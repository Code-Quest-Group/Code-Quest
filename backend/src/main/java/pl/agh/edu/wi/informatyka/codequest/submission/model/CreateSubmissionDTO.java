package pl.agh.edu.wi.informatyka.codequest.submission.model;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Tag(name = "DTO for posting submission")
@Data
public class CreateSubmissionDTO {

    @NotBlank
    @Schema(description = "Source code")
    private String sourceCode;

    @NotBlank
    @Schema(description = "Problem ID")
    private String problemId;

    @NotNull
    @Schema(description = "Language")
    private Language language;

    @Schema(description = "Standard input")
    private String stdin;
}
