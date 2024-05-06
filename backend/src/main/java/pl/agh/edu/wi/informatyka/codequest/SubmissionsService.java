package pl.agh.edu.wi.informatyka.codequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SubmissionsService {

    private final String judgingServiceUrl;

    public SubmissionsService(@Value("${judge0.service.url}") String judgingServiceUrl) {
        this.judgingServiceUrl = judgingServiceUrl;
        System.out.println("service url: " + judgingServiceUrl);
    }

    public String submitCode(String sourceCode) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(sourceCode, headers);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(judgingServiceUrl + "/submissions?wait=true", request, String.class);
        System.out.println("RESPONSE: " + response);
        return response;

    }
}
