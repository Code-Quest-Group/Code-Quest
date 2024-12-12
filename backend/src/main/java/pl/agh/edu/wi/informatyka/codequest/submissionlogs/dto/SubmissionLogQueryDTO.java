package pl.agh.edu.wi.informatyka.codequest.submissionlogs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SubmissionLogQueryDTO {
    @Schema(description = "Submission ID", example = "678345435")
    private String submissionId;

    private String userId;
}
