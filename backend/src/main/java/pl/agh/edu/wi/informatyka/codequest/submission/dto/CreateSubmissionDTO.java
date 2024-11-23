package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Tag(name = "DTO for posting submission")
@Data
public class CreateSubmissionDTO {

    @NotBlank
    @Schema(description = "Source code")
    @JsonProperty("source_code")
    private String sourceCode;

    @NotBlank
    @Schema(description = "Problem ID")
    @JsonProperty("problem_id")
    private String problemId;

    @NotNull
    @Schema(description = "Language")
    private Language language;

    @Schema(hidden = true)
    private User user = null;
}
