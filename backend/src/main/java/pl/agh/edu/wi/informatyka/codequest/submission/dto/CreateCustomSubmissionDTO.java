package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Tag(name = "DTO for posting custom submission")
@Data
public class CreateCustomSubmissionDTO extends CreateSubmissionDTO {

    @Schema(description = "Custom user testcases")
    @JsonProperty("custom_testcases")
    private String customTestcases = null;
}
