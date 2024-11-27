package pl.agh.edu.wi.informatyka.codequest.user.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemStatus;

@Data
public class UserProblemDetails {

    @JsonProperty("user_problem_status")
    private UserProblemStatus status = UserProblemStatus.NOT_ATTEMPTED;

    @JsonProperty("submission_count")
    private int submissionCount = 0;

    @JsonProperty("last_submission_time")
    private Instant lastSubmissionTime = null;

    Double rating;
}
