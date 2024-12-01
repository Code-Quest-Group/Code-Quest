package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
@AllArgsConstructor
public class PublicSubmission {
    @JsonProperty("submission_id")
    private String submissionId;

    @JsonProperty("user_id")
    private String userId;

    private String username;

    private String code;

    Language language;

    Instant date;

    Float time;
    Float memory;
}
