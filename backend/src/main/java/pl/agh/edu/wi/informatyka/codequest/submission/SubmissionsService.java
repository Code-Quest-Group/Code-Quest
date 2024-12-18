package pl.agh.edu.wi.informatyka.codequest.submission;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.CodeTemplatesService;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.judge0.Judge0Service;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.CodePreprocessorFactory;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.SourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.*;
import pl.agh.edu.wi.informatyka.codequest.submission.event.SubmissionExecutionCompletedEvent;
import pl.agh.edu.wi.informatyka.codequest.submission.event.SubmissionJudgedEvent;
import pl.agh.edu.wi.informatyka.codequest.submission.model.*;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.SubmissionLogsRepository;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;
import pl.agh.edu.wi.informatyka.codequest.user.model.Role;

@Service
public class SubmissionsService {

    Logger logger = LoggerFactory.getLogger(SubmissionsService.class);

    private final SubmissionsRepository submissionsRepository;

    private final SubmissionVerifierService submissionVerifierService;
    private final ProblemsService problemsService;
    private final CodeTemplatesService codeTemplatesService;
    private final CodePreprocessorFactory codePreprocessorFactory;
    private final SubmissionLogsRepository submissionLogsRepository;

    private final SubmissionMapper submissionMapper;

    private final Judge0Service judge0Service;

    private final ApplicationEventPublisher eventPublisher;

    private final Map<String, CustomSubmission> customSubmissions = new ConcurrentHashMap<>();
    private final Map<String, String> customSubmissionTokenMapping = new ConcurrentHashMap<>();

    public SubmissionsService(
            ProblemsService problemsService,
            CodeTemplatesService codeTemplatesService,
            CodePreprocessorFactory codePreprocessorFactory,
            SubmissionsRepository submissionsRepository,
            SubmissionVerifierService submissionVerifierService,
            SubmissionLogsRepository submissionLogsRepository,
            SubmissionMapper submissionMapper,
            Judge0Service judge0Service,
            ApplicationEventPublisher eventPublisher) {
        this.problemsService = problemsService;
        this.codeTemplatesService = codeTemplatesService;
        this.codePreprocessorFactory = codePreprocessorFactory;
        this.submissionsRepository = submissionsRepository;
        this.submissionVerifierService = submissionVerifierService;
        this.submissionLogsRepository = submissionLogsRepository;
        this.submissionMapper = submissionMapper;
        this.judge0Service = judge0Service;
        this.eventPublisher = eventPublisher;
    }

    public String submitSubmission(CreateSubmissionDTO createSubmissionDTO) {
        String code;
        try {
            SourceCodePreprocessor codePreprocessor =
                    this.codePreprocessorFactory.getCodePreprocessor(createSubmissionDTO.getLanguage());
            code = codePreprocessor.assembleCustomSubmissionSourceCode(createSubmissionDTO.getSourceCode());
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to assemble submission request: " + e.getMessage());
        }

        Problem currentProblem = problemsService.getProblemOrThrow(createSubmissionDTO.getProblemId());
        Map<String, String> judge0args =
                judge0Service.assembleProblemProposalArgs(createSubmissionDTO, currentProblem, code);

        String token = judge0Service.postSubmission(judge0args);
        Submission submission = this.submissionMapper.createEntityFromDto(createSubmissionDTO);
        submission.setToken(token);
        submission = submissionsRepository.save(submission);
        SubmissionLog submissionLog = new SubmissionLog(
                submission.getSubmissionId(), createSubmissionDTO.getUser().getUserId(), token, SubmissionType.REGULAR);
        submissionLogsRepository.save(submissionLog);
        return submission.getSubmissionId();
    }

    public String submitCustomSubmission(CreateCustomSubmissionDTO createCustomSubmissionDTO) {
        Problem currentProblem = problemsService.getProblemOrThrow(createCustomSubmissionDTO.getProblemId());

        String code;
        try {
            SourceCodePreprocessor codePreprocessor =
                    this.codePreprocessorFactory.getCodePreprocessor(createCustomSubmissionDTO.getLanguage());
            CodeTemplate codeTemplate = this.codeTemplatesService.getSolutionCodeTemplate(createCustomSubmissionDTO);

            code = codePreprocessor.assembleCustomSubmissionSourceCode(
                    createCustomSubmissionDTO.getSourceCode(), codeTemplate);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to assemble submission request: " + e.getMessage());
        }

        Map<String, String> argsMap =
                judge0Service.assembleCustomSubmissionArgs(createCustomSubmissionDTO, currentProblem, code);

        String token = judge0Service.postSubmission(argsMap);

        CustomSubmission submission = this.submissionMapper.createCustomSubmissionFromDto(createCustomSubmissionDTO);
        submission.setToken(token);

        SubmissionLog submissionLog = new SubmissionLog(
                submission.getSubmissionId(),
                createCustomSubmissionDTO.getUser().getUserId(),
                token,
                SubmissionType.CUSTOM);
        submissionLogsRepository.save(submissionLog);

        this.customSubmissions.put(submission.getSubmissionId(), submission);
        this.customSubmissionTokenMapping.put(submission.getToken(), submission.getSubmissionId());

        return submission.getSubmissionId();
    }

    public List<Submission> getSubmissions(SubmissionQueryDTO submissionQueryDTO) {
        Specification<Submission> spec = SubmissionSpecification.buildSpecification(submissionQueryDTO);
        List<Submission> submissionList = submissionsRepository.findAll(spec);
        this.checkForSubmissionsThatMightNeedFetching(submissionList);
        return submissionList;
    }

    @EventListener
    public void handleSubmissionExecutionCompletedEvent(SubmissionExecutionCompletedEvent event) {
        Judge0SubmissionResultDTO result = event.getSubmissionResult();

        SubmissionLog log = submissionLogsRepository.findByToken(result.getToken());
        if (log == null) {
            logger.warn("Submission {} not found in logsRepository!", result.getToken());
            return;
        }

        switch (log.getSubmissionType()) {
            case REGULAR -> {
                Submission submission = this.submissionsRepository
                        .findByToken(result.getToken())
                        .orElse(null);
                if (submission == null) {
                    logger.warn("Submission with token {} not found in the database", result.getToken());
                    return;
                }
                submissionMapper.updateEntityFromDto(submission, result);
                this.submissionVerifierService.judgeSubmissionResults(submission, result);
                submission = submissionsRepository.save(submission);
                logger.info(
                        "Submission {} finished judging, result: {} / {}",
                        result.getToken(),
                        submission.getCorrectTestcases(),
                        submission.getTotalTestcases());

                this.eventPublisher.publishEvent(new SubmissionJudgedEvent(this, submission));
            }

            case CUSTOM -> {
                String submissionId = this.customSubmissionTokenMapping.get(result.getToken());
                CustomSubmission customSubmission = this.customSubmissions.get(submissionId);
                submissionMapper.updateEntityFromDto(customSubmission, result);
                this.submissionVerifierService.judgeCustomSubmissionResults(customSubmission, result);
                logger.info(
                        "Submission {} finished judging, result: {} / {}",
                        result.getToken(),
                        customSubmission.getCorrectTestcases(),
                        customSubmission.getTotalTestcases());
            }

            case PROBLEM_PROPOSAL -> {
                return; // igore problem proposal submission
            }

            case UNKNOWN -> {}
        }
    }

    public CustomSubmission getCustomSubmission(CustomSubmissionQueryDTO customSubmissionQueryDTO) {
        CustomSubmission customSubmission = this.customSubmissions.get(customSubmissionQueryDTO.getSubmissionId());
        if (customSubmission == null
                || (customSubmissionQueryDTO.getUser().getUserRole() != Role.ADMIN
                        && !Objects.equals(
                                customSubmission.getUserId(),
                                customSubmissionQueryDTO.getUser().getUserId()))) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Custom submission with id '" + customSubmissionQueryDTO.getSubmissionId() + "' not found");
        }
        this.checkForSubmissionsThatMightNeedFetching(List.of(customSubmission));
        return customSubmission;
    }

    public Submission getSubmissionOrThrow(String submissionId) {
        return this.submissionsRepository
                .findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Submission with id '" + submissionId + "' not found"));
    }

    public void publishSubmission(Submission submission) {
        if (submission.getStatus() != SubmissionStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission is not accepted");
        }
        logger.info("Publishing submission {}", submission.getSubmissionId());
        submission.setPublic(true);
        this.submissionsRepository.save(submission);
    }

    public List<PublicSubmission> getPublicSubmissions(String problemId) {
        return this.submissionsRepository.getPublicByProblemId(problemId).stream()
                .map(submission -> new PublicSubmission(
                        submission.getSubmissionId(),
                        submission.getUserId(),
                        submission.getUser().getUsername(),
                        submission.getUserCode(),
                        submission.getLanguage(),
                        submission.getFinishedAt(),
                        submission.getTime(),
                        submission.getMemory()))
                .toList();
    }

    // if there are submissions that are still processing after 10 seconds that can mean judge0 webhook was lost.
    private void checkForSubmissionsThatMightNeedFetching(List<Submission> submissionList) {
        Instant now = Instant.now();
        submissionList.stream()
                .filter(submission -> submission.getStatus() == SubmissionStatus.PROCESSING
                        && now.plus(10, ChronoUnit.SECONDS).isAfter(submission.getUpdatedAt()))
                .forEach(this::fetchSubmissionFromJudge0);
    }

    public void fetchSubmissionFromJudge0(Submission submission) {
        this.logger.warn("Manually fetching submission {}", submission.getToken());
        Judge0SubmissionResultDTO result = judge0Service.fetchSubmission(submission.getToken());
        if (result != null) {
            SubmissionStatus status =
                    SubmissionStatus.fromId(result.getJudge0Status().getId());
            if (status == SubmissionStatus.PROCESSING || status == SubmissionStatus.IN_QUEUE) {
                this.logger.info("Submission {} is still processing!", submission.getToken());
                return;
            }
            this.eventPublisher.publishEvent(new SubmissionExecutionCompletedEvent(this, result));
        } else {
            logger.error("Submission {} not found in judge0.", submission.getToken());
        }
    }
}
