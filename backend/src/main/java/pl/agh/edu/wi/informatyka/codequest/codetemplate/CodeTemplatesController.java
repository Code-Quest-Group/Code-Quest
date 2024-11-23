package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CodeTemplateQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateResponse;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@RestController()
@RequestMapping("/problems/templates")
public class CodeTemplatesController {

    private final CodeTemplatesService codeTemplatesService;

    public CodeTemplatesController(CodeTemplatesService codeTemplatesService) {
        this.codeTemplatesService = codeTemplatesService;
    }

    @GetMapping()
    public ResponseEntity<GenericResponse<List<CodeTemplate>>> getCodeTemplates(
            @Valid CodeTemplateQueryDTO codeTemplateQueryDTO) {
        List<CodeTemplate> codeTemplates = this.codeTemplatesService.getCodeTemplates(codeTemplateQueryDTO);

        return ResponseEntity.status(HttpStatus.OK)
                .body(GenericResponse.<List<CodeTemplate>>builder()
                        .status(ResponseStatus.OK)
                        .data(codeTemplates)
                        .build());
    }

    @PostMapping()
    @Operation(security = @SecurityRequirement(name = "adminBearerAuth"))
    public ResponseEntity<GenericResponse<CreateCodeTemplateResponse>> createCodeTemplate(
            @Valid @RequestBody CreateCodeTemplateDTO createCodeTemplateDTO, @AuthenticationPrincipal User user) {
        return this.codeTemplatesService.createCodeTemplate(createCodeTemplateDTO);
    }

    @DeleteMapping()
    @Operation(security = @SecurityRequirement(name = "adminBearerAuth"))
    public ResponseEntity<GenericResponse<Object>> deleteCodeTemplate(
            @Valid @RequestBody Long codeTemplateId, @AuthenticationPrincipal User user) {
        this.codeTemplatesService.deleteCodeTemplate(codeTemplateId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(GenericResponse.builder()
                        .status(ResponseStatus.OK)
                        .message("Successfully deleted")
                        .build());
    }
}