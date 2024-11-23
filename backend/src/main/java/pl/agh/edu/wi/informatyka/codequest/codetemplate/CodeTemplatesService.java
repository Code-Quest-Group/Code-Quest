package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CodeTemplateQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateResponse;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@Service
public class CodeTemplatesService {
    private final CodeTemplatesRepository codeTemplatesRepository;
    private final ProblemsRepository problemsRepository;

    public CodeTemplatesService(
            CodeTemplatesRepository codeTemplatesRepository, ProblemsRepository problemsRepository) {
        this.codeTemplatesRepository = codeTemplatesRepository;
        this.problemsRepository = problemsRepository;
    }

    public ResponseEntity<GenericResponse<CreateCodeTemplateResponse>> createCodeTemplate(
            CreateCodeTemplateDTO createCodeTemplateDTO) {
        if (!this.problemsRepository.existsById(createCodeTemplateDTO.getProblemId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(GenericResponse.<CreateCodeTemplateResponse>builder()
                            .status(ResponseStatus.ERROR)
                            .message("Invalid problem_id " + createCodeTemplateDTO.getProblemId())
                            .build());
        }
        CodeTemplate codeTemplate = new CodeTemplate();
        codeTemplate.setLanguage(createCodeTemplateDTO.getLanguage());
        codeTemplate.setProblemId(createCodeTemplateDTO.getProblemId());
        codeTemplate.setCode(createCodeTemplateDTO.getCode());
        codeTemplate.setTemplateType(createCodeTemplateDTO.getTemplateType());

        codeTemplate = this.codeTemplatesRepository.save(codeTemplate);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GenericResponse.<CreateCodeTemplateResponse>builder()
                        .status(ResponseStatus.OK)
                        .data(new CreateCodeTemplateResponse(codeTemplate.getId()))
                        .build());
    }

    public List<CodeTemplate> getCodeTemplates(CodeTemplateQueryDTO codeTemplateQueryDTO) {
        Specification<CodeTemplate> spec = CodeTemplateSpecification.buildSpecification(codeTemplateQueryDTO);

        return this.codeTemplatesRepository.findAll(spec);
    }

    public void deleteCodeTemplate(Long codeTemplateId) {
        this.codeTemplatesRepository.deleteById(codeTemplateId);
    }

    public CodeTemplate getSolutionCodeTemplate(CreateSubmissionDTO dto) {
        CodeTemplate codeTemplate = this.codeTemplatesRepository
                .findByProblemIdAndLanguageAndTemplateType(
                        dto.getProblemId(), dto.getLanguage(), TemplateType.REFERENCE_SOLUTION)
                .orElseThrow(() -> new IllegalArgumentException("CodeTemplate not found"));

        return codeTemplate;
    }
}
