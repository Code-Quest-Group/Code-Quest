package pl.agh.edu.wi.informatyka.codequest.codetemplate.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class CreateCodeTemplateDTO {

    @JsonProperty("problem_id")
    private String problemId;

    private Language language;

    @JsonProperty("template_type")
    private TemplateType templateType;

    private String code;
}
