package pl.agh.edu.wi.informatyka.codequest.problem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CreateProblemResponse {
    @JsonProperty("problem_id")
    String problemId;

    public CreateProblemResponse(String problemId) {
        this.problemId = problemId;
    }
}
