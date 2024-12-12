package pl.agh.edu.wi.informatyka.codequest.problem;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.judge0.Judge0Service;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.ProblemProposalDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.problem.model.ProblemStatus;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.CodePreprocessorFactory;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.SourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.model.SubmissionStatus;
import pl.agh.edu.wi.informatyka.codequest.submission.model.SubmissionType;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.SubmissionLogsRepository;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;

@Service
public class ProblemProposalsService {
    Logger logger = LoggerFactory.getLogger(ProblemProposalsService.class);

    private final ProblemsRepository problemsRepository;
    private final Judge0Service judge0Service;
    private final CodePreprocessorFactory codePreprocessorFactory;
    private final SubmissionLogsRepository submissionLogsRepository;

    public ProblemProposalsService(
            ProblemsRepository problemsRepository,
            Judge0Service judge0Service,
            CodePreprocessorFactory codePreprocessorFactory,
            SubmissionLogsRepository submissionLogsRepository) {
        this.problemsRepository = problemsRepository;
        this.judge0Service = judge0Service;
        this.codePreprocessorFactory = codePreprocessorFactory;
        this.submissionLogsRepository = submissionLogsRepository;
    }

    public List<Problem> getAllPending() {
        return this.problemsRepository.findAllByProblemStatus(ProblemStatus.PENDING);
    }

    public List<Problem> getAllByUser(String userId) {
        return this.problemsRepository.findAllByAuthorUserId(userId);
    }

    public void createProblemProposal(ProblemProposalDTO problemProposalDTO) {
        if (problemsRepository.existsById(problemProposalDTO.getProblemId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, problemProposalDTO.getProblemId() + " already exists");
        }
        if (problemProposalDTO.getSupportedLanguage() != Language.PYTHON) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Currently only PYTHON is supported");
        }
        if (problemProposalDTO.getReferenceSolution().contains("print(")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Reference solution can't have any print statements");
        }

        long inputArgsCount = problemProposalDTO.getInputFormat().split("\\s+").length;
        long exampleLinesCount =
                problemProposalDTO.getExampleTestcases().lines().count();
        long testcaseLinesCount = problemProposalDTO.getTestCases().lines().count();
        logger.debug(
                "inputArgsCount: {}, exampleLinesCount: {}, testcaseLinesCount: {}",
                inputArgsCount,
                exampleLinesCount,
                testcaseLinesCount);
        if (exampleLinesCount % inputArgsCount != 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "There are %d example testcases args, but each test case needs %d args"
                            .formatted(exampleLinesCount, inputArgsCount));
        }
        if (testcaseLinesCount % inputArgsCount != 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "There are %d testcases args, but each test case needs %d args"
                            .formatted(testcaseLinesCount, inputArgsCount));
        }

        CodeTemplate referenceTemplate = new CodeTemplate(
                problemProposalDTO.getProblemId(),
                problemProposalDTO.getSupportedLanguage(),
                TemplateType.REFERENCE_SOLUTION,
                problemProposalDTO.getReferenceSolution());

        CodeTemplate codeTemplate = new CodeTemplate(
                problemProposalDTO.getCodeTemplate(),
                problemProposalDTO.getSupportedLanguage(),
                TemplateType.DEFAULT_DEFINITION,
                problemProposalDTO.getCodeTemplate());

        String code;

        try {
            SourceCodePreprocessor codePreprocessor =
                    this.codePreprocessorFactory.getCodePreprocessor(problemProposalDTO.getSupportedLanguage());
            code = codePreprocessor.assembleProblemVerifierSourceCode(referenceTemplate);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to assemble problem proposal request: " + e.getMessage());
        }

        Map<String, String> args = this.judge0Service.assembleProblemProposalArgs(problemProposalDTO, code);
        logger.debug("CREATE_PROBLEM_PROPOSAL_ARGS {}", args);
        String token = this.judge0Service.postSubmission(args);

        SubmissionLog submissionLog = new SubmissionLog(
                "problem_proposal_" + problemProposalDTO.getProblemId(),
                problemProposalDTO.getAuthor().getUserId(),
                token,
                SubmissionType.PROBLEM_PROPOSAL);
        this.submissionLogsRepository.save(submissionLog);

        Judge0SubmissionResultDTO result;
        SubmissionStatus status;
        try {
            long startTime = System.currentTimeMillis();
            long timeout = 10 * 1000;

            do {
                if (System.currentTimeMillis() - startTime > timeout) {
                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Polling for submission status timed out after 10 seconds");
                }
                System.out.println("sleeping...");
                Thread.sleep(500);
                result = this.judge0Service.fetchSubmission(token);
                status = SubmissionStatus.fromId(result.getJudge0Status().getId());
            } while (status == SubmissionStatus.PROCESSING || status == SubmissionStatus.IN_QUEUE);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Thread interrupted");
        }
        status = SubmissionStatus.fromId(result.getJudge0Status().getId());

        if (status != SubmissionStatus.ACCEPTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Problem proposal failed to execute: stdout:" + result.getStdout() + "\nstderr: "
                            + result.getStderr());
        }

        List<String> lines = result.getStdout().lines().toList();
        if (lines.get(0).equals("===ERROR===")) {
            logger.debug(
                    "CREATE_PROBLEM_PROPOSAL_ERROR stdout: {}\n stderr: {}", result.getStdout(), result.getStderr());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, lines.get(1));
        }

        long testcaseCount = exampleLinesCount / inputArgsCount;

        List<String> exampleAnswers = lines.stream().limit(testcaseCount).toList();
        if (testcaseCount != problemProposalDTO.getExampleExpectedResult().size()) {
            logger.debug("CREATE_PROBLEM_PROPOSAL_ERROR testcase count and answer length doesn't match");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testcase count and answer length doesn't match");
        }

        logger.debug(
                "exampleAnswers: {}\n execution answer: {}",
                problemProposalDTO.getExampleExpectedResult(),
                exampleAnswers);
        for (int i = 0; i < testcaseCount; i++) {
            if (!exampleAnswers
                    .get(i)
                    .equals(problemProposalDTO.getExampleExpectedResult().get(i))) {
                logger.debug(
                        "CREATE_PROBLEM_PROPOSAL_ERROR Testcase #{} - code execution answer doesn't match exampleExpectedResult. Got: {} expected: {}",
                        i + 1,
                        exampleAnswers.get(i),
                        problemProposalDTO.getExampleExpectedResult().get(i));
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Testcase #" + (i + 1) + "- code execution answer doesn't match exampleExpectedResult. Got: "
                                + exampleAnswers.get(i) + " expected: "
                                + problemProposalDTO.getExampleExpectedResult().get(i));
            }
        }

        String expectedResult = lines.stream()
                .skip(exampleLinesCount / inputArgsCount)
                .reduce((line1, line2) -> line1 + "\n" + line2)
                .orElse("");

        logger.info("Problem proposal {} passed all verification successfully!", problemProposalDTO.getProblemId());

        Problem problem = new Problem();
        problem.setProblemId(problemProposalDTO.getProblemId());
        problem.setName(problemProposalDTO.getName());
        problem.setDescription(problemProposalDTO.getDescription());
        problem.setSupportedLanguages(List.of(problemProposalDTO.getSupportedLanguage()));
        problem.setInputFormat(problemProposalDTO.getInputFormat());
        problem.setCodeTemplate(problemProposalDTO.getCodeTemplate());
        problem.setTestCases(problemProposalDTO.getTestCases());
        problem.setProblemStatus(ProblemStatus.PENDING);
        problem.setExpectedResult(expectedResult);
        problem.setTags(problemProposalDTO.getTags());
        problem.setConstraints(problemProposalDTO.getConstraints());
        problem.setHints(problemProposalDTO.getHints());
        problem.setSubmissions(List.of());
        problem.setExampleTestcases(problemProposalDTO.getExampleTestcases());
        problem.setExampleExpectedResult(problemProposalDTO.getExampleExpectedResult());
        problem.setCodeTemplates(List.of(referenceTemplate, codeTemplate));

        problemsRepository.save(problem);
    }

    public void approveProblem(String problemId) {
        this.problemsRepository.updateStatus(problemId, ProblemStatus.APPROVED);
    }

    public void rejectProblem(String problemId) {
        this.problemsRepository.updateStatus(problemId, ProblemStatus.REJECTED);
    }
}
