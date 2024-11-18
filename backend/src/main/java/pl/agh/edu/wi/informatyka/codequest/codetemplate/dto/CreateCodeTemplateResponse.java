package pl.agh.edu.wi.informatyka.codequest.codetemplate.dto;

import lombok.Data;

@Data
public class CreateCodeTemplateResponse {
    Long id;

    public CreateCodeTemplateResponse(Long id) {
        this.id = id;
    }
}
