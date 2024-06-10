package pl.agh.edu.wi.informatyka.codequest.submission;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;

@Service
public class SubmissionsService {

    private final String judgingServiceUrl;

    public SubmissionsService(@Value("${judge0.service.url}") String judgingServiceUrl) {
        this.judgingServiceUrl = judgingServiceUrl;
        System.out.println("service url: " + judgingServiceUrl);
    }

    public String submitSubmission(CreateSubmissionDTO createSubmissionDTO) {
        //        HttpHeaders headers = new HttpHeaders();
        //        headers.setContentType(MediaType.APPLICATION_JSON);
        //
        //        HttpEntity<String> request = new HttpEntity<>(sourceCode, headers);
        //
        //        RestTemplate restTemplate = new RestTemplate();
        //        String response = restTemplate.postForObject(judgingServiceUrl +
        // "/submissions?wait=true", request,
        // String.class);
        //        System.out.println("RESPONSE: " + response);
        //        return response;
        return "576d8010-c8a1-4e08-9bc6-400da4f22c99";
    }
}
