package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CustomSubmission extends Submission {

    @JsonProperty("submission_id")
    private String submissionId;

    @JsonProperty("user_code")
    private String userCode;

    @JsonProperty("user_answer")
    JsonNode[] userAnswers;

    @JsonProperty("user_output")
    JsonNode[] userOutput;

    @JsonProperty("expected_answer")
    JsonNode[] expectedAnswers;

    public CustomSubmission() {
        this.createdAt = ZonedDateTime.now();
        submissionId = "custom_submission_" + UUID.randomUUID();
    }
}
