package pl.agh.edu.wi.informatyka.codequest.problemrating.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class ProblemRatingId implements Serializable {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("problem_id")
    private String problemId;

    public ProblemRatingId() {}

    public ProblemRatingId(String userId, String problemId) {
        this.userId = userId;
        this.problemId = problemId;
    }
}
