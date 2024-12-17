package pl.agh.edu.wi.informatyka.codequest.codetemplate.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class CreateCodeTemplateDTO {

    @JsonProperty("problem_id")
    private String problemId;

    private Language language;

    @JsonProperty("reference_solution")
    @NotEmpty
    private String referenceSolution;

    @NotEmpty
    @JsonProperty("default_definition")
    private String defaultDefinition;
}
