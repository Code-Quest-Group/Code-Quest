package pl.agh.edu.wi.informatyka.codequest.codetemplate.dto;

import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;

@Data
public class UpdateCodeTemplateDTO {
    String problemId;

    private TemplateType templateType;
    private String code;
}
