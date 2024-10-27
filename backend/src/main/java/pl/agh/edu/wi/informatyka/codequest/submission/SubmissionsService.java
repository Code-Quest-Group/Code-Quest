package pl.agh.edu.wi.informatyka.codequest.submission;

import static pl.agh.edu.wi.informatyka.codequest.sourcecode.Language.PYTHON;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.agh.edu.wi.informatyka.codequest.problem.Problem;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.PythonSourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.model.*;

@Service
public class SubmissionsService {

    Logger logger = LoggerFactory.getLogger(SubmissionsService.class);

    ConcurrentMap<String, Submission> submissions = new ConcurrentHashMap<>();

    private final ProblemsService problemsService;

    private final String judgingServiceUrl;

    @Value("${language.parsers.resources.path}")
    private String resourcesPath;

    public SubmissionsService(
            ProblemsService problemsService, @Value("${judge0.service.url}") String judgingServiceUrl) {
        this.problemsService = problemsService;
        this.judgingServiceUrl = judgingServiceUrl;
        logger.info("Judge 0 service url: {}", judgingServiceUrl);
    }

    public String submitSubmission(CreateSubmissionDTO createSubmissionDTO) throws IOException {
        HttpEntity<String> request = assembleJudgeRequest(createSubmissionDTO);

        RestTemplate restTemplate = new RestTemplate();
        JsonNode jsonResponse = restTemplate.postForObject(judgingServiceUrl + "/submissions", request, JsonNode.class);
        if (jsonResponse == null)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No token returned???");

        String token = jsonResponse.get("token").textValue();
        Submission submission = SubmissionMapper.createEntityFromDto(createSubmissionDTO);
        submission.setToken(token);

        submissions.put(token, submission);
        logger.info(
                "Submission {} created for {} in {}",
                submission.getToken(),
                submission.getProblemId(),
                submission.getLanguage());
        return jsonResponse.toString();
    }

    private HttpEntity<String> assembleJudgeRequest(CreateSubmissionDTO createSubmissionDTO) throws IOException {
        PythonSourceCodePreprocessor codePreprocessor = new PythonSourceCodePreprocessor(resourcesPath);

        String code = codePreprocessor.assembleSourceCode(createSubmissionDTO.getSourceCode());

        //        System.out.println("===========================================");
        //        System.out.println("assembled source code: " + code);
        //        System.out.println("===========================================");

        Problem currentProblem = problemsService
                .getProblem(createSubmissionDTO.getProblemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Problem with id '" + createSubmissionDTO.getProblemId() + "' not found"));

        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", PYTHON.getLanguageId());
        map.put(
                "command_line_arguments",
                "\"" + currentProblem.getInputFormat() + "\""); // input format must be escaped
        map.put("stdin", currentProblem.getTestCases());
        map.put("callback_url", "http://host.docker.internal:8080/submissions/webhook");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = new ObjectMapper().writeValueAsString(map);

        return new HttpEntity<>(body, headers);
    }

    public Submission getSubmission(String submissionId) {
        Submission submission = submissions.get(submissionId);
        if (submission == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found");
        }

        return submission;
    }

    public void handleSubmissionWebhook(Judge0SubmissionResultDTO submissionResultDTO) {
        logger.info("Submission {} finished processing.", submissionResultDTO.getToken());

        URI uri = UriComponentsBuilder.fromHttpUrl(judgingServiceUrl)
                .pathSegment("submissions", submissionResultDTO.getToken())
                .queryParam("fields", "*")
                .build()
                .toUri();

        // this retrieves data for the same token, because the Judge0 webhook returns only a subset of data and a Base64
        // encoded stdout
        final Judge0SubmissionResultDTO newSubmissionResultDTO =
                new RestTemplate().getForObject(uri, Judge0SubmissionResultDTO.class);

        if (newSubmissionResultDTO == null) {
            logger.error("Submission {} not found in judge0.", submissionResultDTO.getToken());
            return;
        }
        logger.debug("Submission {} raw results: {}", newSubmissionResultDTO.getToken(), newSubmissionResultDTO);

        submissions.computeIfPresent(newSubmissionResultDTO.getToken(), (token, submissionInMap) -> {
            SubmissionMapper.updateEntityFromDto(submissionInMap, newSubmissionResultDTO);
            judgeSubmissionResults(submissionInMap);
            return submissionInMap;
        });

        // thread safe map updating

    }

    private void judgeSubmissionResults(Submission submission) {
        assert submission != null;

        // check only submission that finished successfully to the end
        if (submission.getStatus() != SubmissionStatus.ACCEPTED) {
            logger.warn(
                    "Submission {} failed with status {} and message {}, stderr: {}.",
                    submission.getToken(),
                    submission.getStatus().name(),
                    submission.getErrorMessage(),
                    submission.getStderr());
            return; //
        }

        Problem problem = problemsService.getProblem(submission.getProblemId()).orElseThrow();

        // TODO This will fail when user writes to stdout, fix: https://github.com/judge0/judge0/issues/290
        String[] submissionOutput = submission.getStdout().split("\n");
        String[] expectedOutput = problem.getExpectedResult().split("\n");
        int correctTestcasesCount = 0;
        int totalTestcasesCount = expectedOutput.length;
        int len = Math.min(submissionOutput.length, expectedOutput.length);
        String wrongAnswerMessage = null;

        for (int i = 0; i < len; i++) {
            if (submissionOutput[i].equals(expectedOutput[i])) {
                correctTestcasesCount++;
            } else if (wrongAnswerMessage == null) {
                String nthTestCase = getNthTestCase(problem, i);
                wrongAnswerMessage = "Testcase '%s', wrong answer '%s' expected '%s'"
                        .formatted(nthTestCase, submissionOutput[i], expectedOutput[i]);
                logger.debug(
                        "Submission {} problem {}: {}",
                        submission.getToken(),
                        submission.getProblemId(),
                        wrongAnswerMessage);
            }
        }

        if (correctTestcasesCount < totalTestcasesCount) {
            submission.setStatus(SubmissionStatus.WRONG_ANSWER);
        }

        submission.setErrorMessage(wrongAnswerMessage);
        submission.setCorrectTestcases(correctTestcasesCount);
        submission.setTotalTestcases(totalTestcasesCount);
    }

    private String getNthTestCase(Problem problem, int n) {
        String[] input = problem.getTestCases().split("\n");
        int inputsCount = problem.getInputFormat().split(" ").length;
        return String.join(" ", Arrays.copyOfRange(input, inputsCount * n, inputsCount * (n + 1)));
    }
}
