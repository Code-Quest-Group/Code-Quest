package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CodeTemplateQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CreateCodeTemplateResponse;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@Service
public class CodeTemplatesService {
    private final CodeTemplatesRepository codeTemplatesRepository;
    private final ProblemsRepository problemsRepository;
    private final ProblemsService problemsService;

    public CodeTemplatesService(
            CodeTemplatesRepository codeTemplatesRepository,
            ProblemsRepository problemsRepository,
            ProblemsService problemsService) {
        this.codeTemplatesRepository = codeTemplatesRepository;
        this.problemsRepository = problemsRepository;
        this.problemsService = problemsService;
    }

    @Transactional
    public ResponseEntity<GenericResponse<CreateCodeTemplateResponse>> createCodeTemplate(
            CreateCodeTemplateDTO createCodeTemplateDTO) {
        Problem problem = this.problemsService.getProblemOrThrow(createCodeTemplateDTO.getProblemId());
        if (problem.getSupportedLanguages().contains(createCodeTemplateDTO.getLanguage())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Template for language %s already exists.".formatted(createCodeTemplateDTO.getLanguage()));
        }

        CodeTemplate referenceSolution = new CodeTemplate(
                createCodeTemplateDTO.getProblemId(),
                createCodeTemplateDTO.getLanguage(),
                TemplateType.REFERENCE_SOLUTION,
                createCodeTemplateDTO.getReferenceSolution());

        CodeTemplate defaultDefinition = new CodeTemplate(
                createCodeTemplateDTO.getProblemId(),
                createCodeTemplateDTO.getLanguage(),
                TemplateType.DEFAULT_DEFINITION,
                createCodeTemplateDTO.getDefaultDefinition());

        this.codeTemplatesRepository.save(referenceSolution);
        this.codeTemplatesRepository.save(defaultDefinition);

        problem.getSupportedLanguages().add(createCodeTemplateDTO.getLanguage());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GenericResponse.<CreateCodeTemplateResponse>builder()
                        .status(ResponseStatus.OK)
                        .message("Successfully added code templates")
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

    public List<CodeTemplate> getDefaultCodeTemplates(String problemId) {
        return this.codeTemplatesRepository.findByProblemIdAndTemplateType(problemId, TemplateType.DEFAULT_DEFINITION);
    }
}
