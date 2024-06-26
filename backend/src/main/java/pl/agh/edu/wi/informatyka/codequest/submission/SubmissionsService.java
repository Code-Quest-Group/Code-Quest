package pl.agh.edu.wi.informatyka.codequest.submission;

import static pl.agh.edu.wi.informatyka.codequest.sourcecode.Language.PYTHON;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
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
import pl.agh.edu.wi.informatyka.codequest.Problem;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.PythonSourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Submission;

@Service
public class SubmissionsService {

    Logger logger = LoggerFactory.getLogger(SubmissionsService.class);

    ConcurrentMap<String, CreateSubmissionDTO> activeSubmissions = new ConcurrentHashMap<>();
    ConcurrentMap<String, Submission> finalizedSubmissions = new ConcurrentHashMap<>();

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

        activeSubmissions.put(token, createSubmissionDTO);
        logger.info(
                "Submission {} created for {} in {}",
                token,
                createSubmissionDTO.getProblemId(),
                createSubmissionDTO.getLanguage());
        return jsonResponse.toString();
    }

    private HttpEntity<String> assembleJudgeRequest(CreateSubmissionDTO createSubmissionDTO) throws IOException {
        PythonSourceCodePreprocessor codePreprocessor = new PythonSourceCodePreprocessor(resourcesPath);

        String code = codePreprocessor.assembleSourceCode(createSubmissionDTO.getSourceCode());

        //        System.out.println("===========================================");
        //        System.out.println("assembled source code: " + code);
        //        System.out.println("===========================================");

        Problem currentProblem = problemsService.getProblem(createSubmissionDTO.getProblemId());
        if (currentProblem == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Problem with id '" + createSubmissionDTO.getProblemId() + "' not found");
        }

        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", PYTHON.getLanguageId());
        map.put("command_line_arguments", "\"int int\"");
        map.put("stdin", currentProblem.getTestCases());
        map.put("callback_url", "http://host.docker.internal:8080/submissions/webhook");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = new ObjectMapper().writeValueAsString(map);

        return new HttpEntity<>(body, headers);
    }

    public Submission getSubmission(String submissionId) {
        Submission finalizedSubmission = finalizedSubmissions.get(submissionId);
        if (finalizedSubmission != null) return finalizedSubmission;

        if (!activeSubmissions.containsKey(submissionId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Submission not found");
        }

        Submission response = new Submission();
        response.setStatus(new Judge0SubmissionResultDTO.Status(2L, "Processing"));
        return response;
    }

    public void handleSubmissionWebhook(Judge0SubmissionResultDTO submissionResultDTO) {
        logger.info("Submission {} finished processing.", submissionResultDTO.getToken());
        CreateSubmissionDTO createdSubmission = activeSubmissions.remove(submissionResultDTO.getToken());
        if (createdSubmission == null) {
            logger.warn("Submission webhook {} returned before POST /submissions", submissionResultDTO.getToken());
            throw new RuntimeException("Webhook returned before POST /submissions");
        }

        // this retrieves the same data again, because the Judge0 webhook returns only a subset of data and a Base64
        // encoded stdout
        Submission submission = new RestTemplate()
                .getForObject(judgingServiceUrl + "/submissions/" + submissionResultDTO.getToken(), Submission.class);

        assert submission != null;
        submission.setProblemId(createdSubmission.getProblemId());
        submission.setLanguage(createdSubmission.getLanguage());
        submission.setUserId("no user");
        finalizedSubmissions.put(submission.getToken(), submission);
    }
}
