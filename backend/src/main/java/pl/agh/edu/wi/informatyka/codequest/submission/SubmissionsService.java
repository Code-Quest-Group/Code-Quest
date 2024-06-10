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
import pl.agh.edu.wi.informatyka.codequest.sourcecode.PythonSourceCodePreprocessor;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;

@Service
public class SubmissionsService {

    private final String judgingServiceUrl;

    public SubmissionsService(@Value("${judge0.service.url}") String judgingServiceUrl) {
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
        PythonSourceCodePreprocessor codePreprocessor = new PythonSourceCodePreprocessor();

        String code = codePreprocessor.assembleSourceCode(createSubmissionDTO.getSourceCode());

        Map<String, String> map = new HashMap<>();

        System.out.println("assembled source code: " + code);

        Problem currentProblem = Problem.addTwoNumbers;

        map.put("source_code", code);
        map.put("language_id", PYTHON.getLanguageId());
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
