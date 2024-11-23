package pl.agh.edu.wi.informatyka.codequest.submission;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
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
import pl.agh.edu.wi.informatyka.codequest.submission.model.*;

@Service
public class SubmissionsService {

    Logger logger = LoggerFactory.getLogger(SubmissionsService.class);

    private final SubmissionsRepository submissionsRepository;
    private final SubmissionVerifierService submissionVerifierService;
    private final ProblemsService problemsService;
    private final CodeTemplatesService codeTemplatesService;
    private final CodePreprocessorFactory codePreprocessorFactory;

    private final SubmissionMapper submissionMapper;

    private final Judge0Service judge0Service;

    private final Map<String, CustomSubmission> customSubmissions = new ConcurrentHashMap<>();
    private final Map<String, String> customSubmissionTokenMapping = new ConcurrentHashMap<>();

    public SubmissionsService(
            ProblemsService problemsService,
            CodeTemplatesService codeTemplatesService,
            CodePreprocessorFactory codePreprocessorFactory,
            SubmissionsRepository submissionsRepository,
            SubmissionVerifierService submissionVerifierService,
            SubmissionMapper submissionMapper,
            Judge0Service judge0Service) {
        this.problemsService = problemsService;
        this.codeTemplatesService = codeTemplatesService;
        this.codePreprocessorFactory = codePreprocessorFactory;
        this.submissionsRepository = submissionsRepository;
        this.submissionVerifierService = submissionVerifierService;
        this.submissionMapper = submissionMapper;
        this.judge0Service = judge0Service;
    }

    public String submitSubmission(CreateSubmissionDTO createSubmissionDTO) {
        String code;
        try {
            SourceCodePreprocessor codePreprocessor =
                    this.codePreprocessorFactory.getCodePreprocessor(createSubmissionDTO.getLanguage());
            code = codePreprocessor.assembleSourceCode(createSubmissionDTO.getSourceCode());
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to assemble submission request: " + e.getMessage());
        }

        Problem currentProblem = problemsService.getProblemOrThrow(createSubmissionDTO.getProblemId());
        Map<String, String> judge0args =
                judge0Service.assembleSubmissionArgs(createSubmissionDTO, currentProblem, code);

        logger.info("Submission judge0args: {}", judge0args);

        String token = judge0Service.postSubmission(judge0args);
        Submission submission = this.submissionMapper.createEntityFromDto(createSubmissionDTO);
        submission.setToken(token);
        submission = submissionsRepository.save(submission);
        return submission.getSubmissionId();
    }

    public String submitCustomSubmission(CreateCustomSubmissionDTO createCustomSubmissionDTO) {
        String code;
        try {
            SourceCodePreprocessor codePreprocessor =
                    this.codePreprocessorFactory.getCodePreprocessor(createCustomSubmissionDTO.getLanguage());
            CodeTemplate codeTemplate = this.codeTemplatesService.getSolutionCodeTemplate(createCustomSubmissionDTO);

            code = codePreprocessor.assembleSourceCode(createCustomSubmissionDTO.getSourceCode(), codeTemplate);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to assemble submission request: " + e.getMessage());
        }

        Problem currentProblem = problemsService.getProblemOrThrow(createCustomSubmissionDTO.getProblemId());

        Map<String, String> argsMap =
                judge0Service.assembleCustomSubmissionArgs(createCustomSubmissionDTO, currentProblem, code);

        String token = judge0Service.postSubmission(argsMap);

        CustomSubmission submission = this.submissionMapper.createCustomSubmissionFromDto(createCustomSubmissionDTO);
        submission.setToken(token);

        this.customSubmissions.put(submission.getSubmissionId(), submission);
        this.customSubmissionTokenMapping.put(submission.getToken(), submission.getSubmissionId());

        return submission.getSubmissionId();
    }

    public List<Submission> getSubmissions(SubmissionQueryDTO submissionQueryDTO) {
        Specification<Submission> spec = SubmissionSpecification.buildSpecification(submissionQueryDTO);
        return submissionsRepository.findAll(spec);
    }

    @Async
    @EventListener
    public void handleSubmissionExecutionCompletedEvent(SubmissionExecutionCompletedEvent event) {
        Judge0SubmissionResultDTO result = event.getSubmissionResult();

        if (this.customSubmissionTokenMapping.containsKey(result.getToken())) {
            String submissionId = this.customSubmissionTokenMapping.get(result.getToken());
            CustomSubmission customSubmission = this.customSubmissions.get(submissionId);
            submissionMapper.updateEntityFromDto(customSubmission, result);
            this.submissionVerifierService.judgeCustomSubmissionResults(customSubmission, result);
            this.customSubmissions.put(customSubmission.getToken(), customSubmission);

        } else {
            Submission submission =
                    this.submissionsRepository.findByToken(result.getToken()).orElse(null);
            if (submission == null) {
                logger.warn("Submission with token {} not found in the database", result.getToken());
                return;
            }
            submissionMapper.updateEntityFromDto(submission, result);
            this.submissionVerifierService.judgeSubmissionResults(submission, result);
            submissionsRepository.save(submission);
        }
    }

    public CustomSubmission getCustomSubmission(CustomSubmissionQueryDTO customSubmissionQueryDTO) {
        CustomSubmission customSubmission = this.customSubmissions.get(customSubmissionQueryDTO.getSubmissionId());
        if (customSubmission == null
                || !Objects.equals(customSubmission.getUserId(), customSubmissionQueryDTO.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Custom submission with id '" + customSubmissionQueryDTO.getSubmissionId() + "' not found");
        }
        return customSubmission;
    }
}
