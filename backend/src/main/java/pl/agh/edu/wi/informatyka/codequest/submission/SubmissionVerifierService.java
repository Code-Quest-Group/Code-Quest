package pl.agh.edu.wi.informatyka.codequest.submission;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.TextNode;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.model.*;

@Service
public class SubmissionVerifierService {

    public static final String ERROR_SEPARATOR = "===ERROR===";
    public static final String USER_STDOUT_SEPARATOR = "===USER_STDOUT_SEPARATOR===";
    public static final String TESTCASE_STDOUT_SEPARATOR = "===TESTCASE_STDOUT_SEPARATOR===";
    public static final String USER_RESULTS_SEPARATOR = "===USER_RESULTS_SEPARATOR===";
    public static final String SYSTEM_STDOUT_SEPARATOR = "===SYSTEM_STDOUT_SEPARATOR===";
    public static final String SYSTEM_RESULT_SEPARATOR = "===SYSTEM_RESULT_SEPARATOR===";

    Logger logger = LoggerFactory.getLogger(SubmissionVerifierService.class);

    private final ObjectMapper objectMapper;

    public SubmissionVerifierService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void judgeSubmissionResults(Submission submission, Judge0SubmissionResultDTO judge0SubmissionResult) {
        SubmissionStatus status =
                SubmissionStatus.fromId(judge0SubmissionResult.getJudge0Status().getId());

        Problem problem = submission.getProblem();

        String[] expectedOutput = problem.getExpectedResult().split("\n");
        List<String> expectedAnswers = Arrays.asList(expectedOutput);

        submission.setCorrectTestcases(0);
        submission.setTotalTestcases(expectedAnswers.size());

        // check only submission that finished successfully to the end
        if (status != SubmissionStatus.ACCEPTED) {
            logger.warn(
                    "Submission {} failed with status {} and message {}, stderr: {}.",
                    submission.getToken(),
                    submission.getStatus().name(),
                    submission.getErrorMessage(),
                    submission.getStderr());
            submission.setStderr(judge0SubmissionResult.getStderr());
            return;
        }

        SubmissionResult submissionResult;
        try {
            submissionResult = this.parseSubmissionOutput(judge0SubmissionResult.getStdout(), SubmissionType.REGULAR);

        } catch (RuntimeException e) {
            logger.error("Failed to parse submission: {}", e.getMessage());

            submission.setStatus(SubmissionStatus.INTERNAL_ERROR);
            submission.setErrorMessage("INTERNAL ERROR: Failed to parse submission result");
            return;
        }

        if (submissionResult.getErrorMessage() != null) {
            submission.setStatus(SubmissionStatus.RUNTIME_ERROR_OTHER);
            submission.setErrorMessage(judge0SubmissionResult.getMessage());
            submission.setStderr(judge0SubmissionResult.getStderr());
        }

        int correctTestcasesCount = 0;
        if (expectedAnswers.size() != submissionResult.getTestAnswers().size()) {
            submission.setStatus(SubmissionStatus.INTERNAL_ERROR);
            submission.setErrorMessage("INTERNAL ERROR: Invalid number of test cases answers");
            return;
        }

        for (int i = 0; i < expectedAnswers.size(); i++) {
            if (submissionResult.getTestAnswers().get(i).equals(expectedAnswers.get(i))) {
                correctTestcasesCount++;
            } else {
                String nthTestCase = getNthTestCase(problem, i);
                String wrongAnswerMessage = "Testcase '%s', wrong answer '%s' expected '%s'"
                        .formatted(
                                nthTestCase, submissionResult.getTestAnswers().get(i), expectedAnswers.get(i));
                submission.setErrorMessage(wrongAnswerMessage);
                break;
            }
        }

        if (correctTestcasesCount < expectedAnswers.size()) {
            submission.setStatus(SubmissionStatus.WRONG_ANSWER);
        }

        submission.setCorrectTestcases(correctTestcasesCount);
    }

    public void judgeCustomSubmissionResults(
            CustomSubmission customSubmission, Judge0SubmissionResultDTO judge0SubmissionResult) {
        SubmissionStatus status =
                SubmissionStatus.fromId(judge0SubmissionResult.getJudge0Status().getId());

        // check only customSubmission that finished successfully to the end
        if (status != SubmissionStatus.ACCEPTED) {
            logger.info("raw judge0SubmissionResult {}", judge0SubmissionResult);
            logger.warn(
                    "Submission {} failed with status {} and message {}",
                    customSubmission.getToken(),
                    customSubmission.getStatus().name(),
                    customSubmission.getErrorMessage());
            return;
        }

        Problem problem = customSubmission.getProblem();

        SubmissionResult submissionResult;
        try {
            submissionResult = this.parseSubmissionOutput(judge0SubmissionResult.getStdout(), SubmissionType.CUSTOM);

        } catch (RuntimeException e) {
            logger.error("Failed to parse customSubmission: {}", e.getMessage());

            customSubmission.setStatus(SubmissionStatus.INTERNAL_ERROR);
            customSubmission.setErrorMessage("INTERNAL ERROR: Failed to parse customSubmission result");
            throw e;
            //            return;
        }

        if (submissionResult.getErrorMessage() != null) {
            customSubmission.setStatus(SubmissionStatus.RUNTIME_ERROR_OTHER);
            customSubmission.setErrorMessage(judge0SubmissionResult.getMessage());
        }

        List<String> expectedAnswers = submissionResult.getSystemAnswers();
        customSubmission.setTotalTestcases(expectedAnswers.size());

        int correctTestcasesCount = 0;
        if (expectedAnswers.size() != submissionResult.getTestAnswers().size()) {
            customSubmission.setStatus(SubmissionStatus.INTERNAL_ERROR);
            customSubmission.setErrorMessage("INTERNAL ERROR: Invalid number of test cases answers");
            return;
        }
        String wrongAnswerMessage = null;

        for (int i = 0; i < expectedAnswers.size(); i++) {
            if (submissionResult.getTestAnswers().get(i).equals(expectedAnswers.get(i))) {
                correctTestcasesCount++;
            } else if (wrongAnswerMessage == null) {
                String nthTestCase = getNthTestCase(problem, i);
                wrongAnswerMessage = "Testcase '%s', wrong answer '%s' expected '%s'"
                        .formatted(
                                nthTestCase, submissionResult.getTestAnswers().get(i), expectedAnswers.get(i));
            }
        }

        if (correctTestcasesCount < expectedAnswers.size()) {
            customSubmission.setStatus(SubmissionStatus.WRONG_ANSWER);
        }

        customSubmission.setErrorMessage(wrongAnswerMessage);
        customSubmission.setCorrectTestcases(correctTestcasesCount);
        try {
            int size = submissionResult.getTestAnswers().size();
            JsonNode[] expectedJSONAnswers = new JsonNode[size];
            JsonNode[] userJSONAnswers = new JsonNode[size];
            JsonNode[] userJSONOutput = new JsonNode[size];
            for (int i = 0; i < size; i++) {
                expectedJSONAnswers[i] = objectMapper.readTree(
                        submissionResult.getSystemAnswers().get(i));
                userJSONAnswers[i] =
                        objectMapper.readTree(submissionResult.getTestAnswers().get(i));
                userJSONOutput[i] =
                        new TextNode(submissionResult.getUserStdout().get(i));
            }
            customSubmission.setUserAnswers(userJSONAnswers);
            customSubmission.setExpectedAnswers(expectedJSONAnswers);
            customSubmission.setUserOutput(userJSONOutput);
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize customSubmission: {}", e.getMessage());
        }
    }

    private String getNthTestCase(Problem problem, int n) {
        String[] input = problem.getTestCases().split("\n");
        int inputsCount = problem.getInputFormat().split(" ").length;
        return String.join(" ", Arrays.copyOfRange(input, inputsCount * n, inputsCount * (n + 1)));
    }

    private SubmissionResult parseSubmissionOutput(String submissionStdout, SubmissionType type) {
        SubmissionResult output = new SubmissionResult();
        if (submissionStdout.startsWith(ERROR_SEPARATOR)) {
            output.setErrorMessage(submissionStdout.substring(ERROR_SEPARATOR.length()));
            return output;
        }

        String[] lines = submissionStdout.split("\n");
        if (lines.length == 0) {
            throw new RuntimeException("Submission output is empty");
        }
        int i = 0;

        if (type == SubmissionType.REGULAR) {
            while (!lines[i].equals(USER_STDOUT_SEPARATOR)) {
                ++i;
            }
            ++i; // skip over USER_STDOUT_SEPARATOR
            while (!lines[i].equals(USER_RESULTS_SEPARATOR)) {
                output.getTestAnswers().add(lines[i]);
                ++i;
            }
        } else {
            while (!lines[i].equals(USER_STDOUT_SEPARATOR)) {
                StringBuilder testcaseStdoutBuilder = new StringBuilder();
                while (!lines[i].equals(TESTCASE_STDOUT_SEPARATOR)) {
                    testcaseStdoutBuilder.append(lines[i]);
                    ++i;
                }
                output.getUserStdout().add(testcaseStdoutBuilder.toString());
                ++i;
            }
            ++i; // skip over USER_STDOUT_SEPARATOR
            while (!lines[i].equals(USER_RESULTS_SEPARATOR)) {
                output.getTestAnswers().add(lines[i]);
                ++i;
            }
            ++i; // skip over USER_STDOUT_SEPARATOR
            while (!lines[i].equals(SYSTEM_STDOUT_SEPARATOR)) {
                ++i;
            }
            ++i; // skip over SYSTEM_STDOUT_SEPARATOR
            while (!lines[i].equals(SYSTEM_RESULT_SEPARATOR)) {
                output.getSystemAnswers().add(lines[i]);
                ++i;
            }
        }

        return output;
    }
}
