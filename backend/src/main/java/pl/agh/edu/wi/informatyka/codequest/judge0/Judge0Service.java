package pl.agh.edu.wi.informatyka.codequest.judge0;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.ProblemProposalDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateCustomSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.event.SubmissionExecutionCompletedEvent;

/** Service responsible for handling communication with Judge0 */
@Service
public class Judge0Service {
    Logger logger = LoggerFactory.getLogger(Judge0Service.class);

    private final ApplicationEventPublisher eventPublisher;

    private final String judgingServiceUrl;
    private final String judgingCallbackUrl;

    private final Map<String, Judge0SubmissionResultDTO> judgeResults = new HashMap<>();
    private final ObjectMapper objectMapper;

    public Judge0Service(
            ApplicationEventPublisher eventPublisher,
            @Value("${judge0.service.url}") String judgingServiceUrl,
            @Value("${judge0.callback.url}") String judgingCallbackUrl,
            ObjectMapper objectMapper) {
        this.eventPublisher = eventPublisher;

        this.judgingServiceUrl = judgingServiceUrl;
        this.judgingCallbackUrl = judgingCallbackUrl;
        this.objectMapper = objectMapper;
        logger.info("Judge 0 service url: {}", judgingServiceUrl);
    }

    public void handleSubmissionWebhook(Judge0SubmissionResultDTO submissionResultDTO) {
        if (judgeResults.containsKey(submissionResultDTO.getToken())) {
            Judge0SubmissionResultDTO previousSubmissionResultDTO = judgeResults.get(submissionResultDTO.getToken());
            if (Objects.equals(
                    previousSubmissionResultDTO.getJudge0Status().getId(),
                    submissionResultDTO.getJudge0Status().getId())) {
                logger.debug("Ignoring duplicate submission webhook {}", submissionResultDTO.getToken());
                return;
            }
        }
        judgeResults.put(submissionResultDTO.getToken(), submissionResultDTO);

        // this retrieves data for the same token, because the Judge0 webhook returns only a subset of data and a Base64
        // encoded stdout
        final Judge0SubmissionResultDTO fullSubmissionResultDTO = this.fetchSubmission(submissionResultDTO.getToken());

        if (fullSubmissionResultDTO == null) {
            logger.error("Submission {} not found in judge0.", submissionResultDTO.getToken());
            return;
        }
        logger.info(
                "Submission {} finished processing, time: {} s.",
                fullSubmissionResultDTO.getToken(),
                String.format(
                        "%.2f",
                        Optional.ofNullable(fullSubmissionResultDTO.getCreatedAt())
                                .flatMap(createdAt -> Optional.ofNullable(fullSubmissionResultDTO.getFinishedAt())
                                        .map(finishedAt -> (double) Duration.between(createdAt, finishedAt)
                                                        .toMillis()
                                                / 1000))
                                .orElse(0.0)));
        this.eventPublisher.publishEvent(new SubmissionExecutionCompletedEvent(this, fullSubmissionResultDTO));
    }

    public String postSubmission(Map<String, String> judge0Args) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String jsonBody = objectMapper.writeValueAsString(judge0Args);

            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            RestTemplate restTemplate = new RestTemplate();
            JsonNode jsonResponse =
                    restTemplate.postForObject(judgingServiceUrl + "/submissions", request, JsonNode.class);
            if (jsonResponse == null)
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No token returned???");

            String token = jsonResponse.get("token").textValue();
            logger.debug("Submission {} send to judge0", token);

            return token;
        } catch (Exception e) {
            logger.error("Failed to post submission to judge0: {}", e.getMessage(), e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to post submission to judge0: " + e.getMessage());
        }
    }

    public Judge0SubmissionResultDTO fetchSubmission(String token) {
        URI uri = UriComponentsBuilder.fromHttpUrl(judgingServiceUrl)
                .pathSegment("submissions", token)
                .queryParam("fields", "*")
                .build()
                .toUri();

        // this retrieves data for the same token, because the Judge0 webhook returns only a subset of data and a Base64
        // encoded stdout
        return new RestTemplate().getForObject(uri, Judge0SubmissionResultDTO.class);
    }

    public Map<String, String> assembleProblemProposalArgs(
            CreateSubmissionDTO createSubmissionDTO, Problem currentProblem, String code) {
        String commandLineArgs = "\"" + currentProblem.getInputFormat() + "\"";
        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", createSubmissionDTO.getLanguage().getLanguageId());
        map.put("command_line_arguments", commandLineArgs);
        map.put("stdin", currentProblem.getTestCases());
        map.put("callback_url", judgingCallbackUrl);
        return map;
    }

    public Map<String, String> assembleCustomSubmissionArgs(
            CreateCustomSubmissionDTO createCustomSubmissionDTO, Problem currentProblem, String code) {
        String commandLineArgs = "\"" + currentProblem.getInputFormat() + "\"" + " --custom-submission";
        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", createCustomSubmissionDTO.getLanguage().getLanguageId());
        map.put("command_line_arguments", commandLineArgs);
        map.put("stdin", createCustomSubmissionDTO.getCustomTestcases());
        map.put("callback_url", judgingCallbackUrl);
        return map;
    }

    public Map<String, String> assembleProblemProposalArgs(ProblemProposalDTO problemProposalDTO, String code) {
        String commandLineArgs = "\"" + problemProposalDTO.getInputFormat() + "\"";
        // trim to avoid \n\n
        String stdin = problemProposalDTO.getExampleTestcases().trim() + '\n' + problemProposalDTO.getTestCases();
        Map<String, String> map = new HashMap<>();
        map.put("source_code", code);
        map.put("language_id", problemProposalDTO.getSupportedLanguage().getLanguageId());
        map.put("command_line_arguments", commandLineArgs);
        map.put("stdin", stdin);
        map.put("callback_url", judgingCallbackUrl);
        return map;
    }
}
