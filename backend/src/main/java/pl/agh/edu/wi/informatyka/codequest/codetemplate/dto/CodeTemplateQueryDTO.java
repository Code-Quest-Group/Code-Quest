package pl.agh.edu.wi.informatyka.codequest.codetemplate.dto;

import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class CodeTemplateQueryDTO {
    private Long id;
    private String problemId;
    private Language language;
    private TemplateType templateType;
}
