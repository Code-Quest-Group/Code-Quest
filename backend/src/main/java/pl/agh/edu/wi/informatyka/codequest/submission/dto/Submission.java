package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("java:S116")
public class Submission extends Judge0SubmissionResultDTO {
    @JsonProperty("user_id")
    String userId;

    @JsonProperty("problem_id")
    String problemId;

    Language language;
}
