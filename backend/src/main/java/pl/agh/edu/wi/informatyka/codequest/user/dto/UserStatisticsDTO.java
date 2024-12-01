package pl.agh.edu.wi.informatyka.codequest.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemAttempt;

@Data
public class UserStatisticsDTO {
    @JsonProperty("submissions_frequency")
    Map<String, Long> submissionsFrequency;

    @JsonProperty("user_problem_attempts")
    private List<UserProblemAttempt> userProblemAttempts;

    @JsonProperty("user_problem_tags_count")
    private Map<String, Long> userProblemTagsCount;

    @JsonProperty("user_ratings")
    private Map<String, Double> userRatings;
}
