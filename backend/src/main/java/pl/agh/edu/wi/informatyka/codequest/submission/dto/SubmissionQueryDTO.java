package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SubmissionQueryDTO {
    @Schema(description = "Submission ID", example = "678345435")
    private String submissionId;

    @Schema(description = "Problem ID")
    private String problemId;

    private String language;

    @Schema(hidden = true)
    private String userId;
}
