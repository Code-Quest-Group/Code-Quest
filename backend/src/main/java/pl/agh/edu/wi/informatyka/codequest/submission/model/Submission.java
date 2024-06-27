package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.ZonedDateTime;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class Submission {
    @JsonProperty("user_id")
    String userId;

    @JsonProperty("problem_id")
    String problemId;

    Language language;

    SubmissionStatus status;

    String token;

    @JsonProperty("correct_testcases")
    Integer correctTestcases;

    @JsonProperty("total_testcases")
    Integer totalTestcases;

    @JsonProperty("error_message")
    String errorMessage;

    @JsonProperty("created_at")
    ZonedDateTime createdAt;

    @JsonProperty("finished_at")
    ZonedDateTime finishedAt;

    String stdout;
    String stderr;

    Float time;
    Float memory;
}
