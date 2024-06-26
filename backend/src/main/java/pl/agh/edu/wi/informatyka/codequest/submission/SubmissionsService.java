package pl.agh.edu.wi.informatyka.codequest.submission;

import static pl.agh.edu.wi.informatyka.codequest.sourcecode.Language.PYTHON;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.agh.edu.wi.informatyka.codequest.Problem;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.PythonSourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.SubmissionResultDTO;

@Service
public class SubmissionsService {

    // those are the databases lmao
    Map<String, SubmissionResultDTO> submissions = new HashMap<>();

    private final ProblemsService problemsService;

    private final String judgingServiceUrl;

    @Value("${language.parsers.resources.path}")
    private String resourcesPath;

    public SubmissionsService(
            ProblemsService problemsService, @Value("${judge0.service.url}") String judgingServiceUrl) {
        this.problemsService = problemsService;
        this.judgingServiceUrl = judgingServiceUrl;
        System.out.println("service url: " + judgingServiceUrl);
    }

    public String submitSubmission(CreateSubmissionDTO createSubmissionDTO) throws IOException {
        HttpEntity<String> request = assembleJudgeRequest(createSubmissionDTO);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(judgingServiceUrl + "/submissions", request, String.class);
        System.out.println("RESPONSE: " + response);
        return response;
    }

    private HttpEntity<String> assembleJudgeRequest(CreateSubmissionDTO createSubmissionDTO) throws IOException {
        PythonSourceCodePreprocessor codePreprocessor = new PythonSourceCodePreprocessor(resourcesPath);

        String code = codePreprocessor.assembleSourceCode(createSubmissionDTO.getSourceCode());

        //        System.out.println("===========================================");
        //        System.out.println("assembled source code: " + code);
        //        System.out.println("===========================================");

        Problem currentProblem = problemsService.getProblem("add-numbers");

        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", PYTHON.getLanguageId());
        map.put("command_line_arguments", "\"int int\"");
        map.put("stdin", currentProblem.getTestCases());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = new ObjectMapper().writeValueAsString(map);

        return new HttpEntity<>(body, headers);
    }

    public String getSubmission(String submissionId) {
        String response =
                new RestTemplate().getForObject(judgingServiceUrl + "/submissions/" + submissionId, String.class);
        System.out.println(response);
        return response;
    }
}
