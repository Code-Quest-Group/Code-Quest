package pl.agh.edu.wi.informatyka.codequest.problem;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.CreateProblemDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.CreateProblemResponse;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.SubmissionsService;
import pl.agh.edu.wi.informatyka.codequest.submission.model.PublicSubmission;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@RestController()
@RequestMapping("/problems")
@Tag(name = "Problems")
public class ProblemsController {
    private final ProblemsService problemsService;
    private final SubmissionsService submissionsService;

    public ProblemsController(ProblemsService problemsService, SubmissionsService submissionsService) {
        this.problemsService = problemsService;
        this.submissionsService = submissionsService;
    }

    @GetMapping("/{problemId}")
    public Problem getProblems(
            @PathVariable @Parameter(example = "add-two-numbers") String problemId,
            @AuthenticationPrincipal User user) {
        if (user != null) {
            return problemsService.getProblemWithUserDetails(problemId, user);
        } else {
            return problemsService.getProblemOrThrow(problemId);
        }
    }

    @GetMapping()
    public List<Problem> getAllProblems(@AuthenticationPrincipal User user) {
        if (user != null) {
            return problemsService.getAllProblemsWithUserDetails(user);

        } else {
            return problemsService.getAllProblems();
        }
    }

    @PostMapping()
    @Operation(security = @SecurityRequirement(name = "adminBearerAuth"))
    public ResponseEntity<GenericResponse<CreateProblemResponse>> createCodeTemplate(
            @Valid @RequestBody CreateProblemDTO createProblemDTO, @AuthenticationPrincipal User user) {
        Problem problem = this.problemsService.createProblem(createProblemDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GenericResponse.<CreateProblemResponse>builder()
                        .status(ResponseStatus.OK)
                        .message("Successfully created new problem")
                        .data(new CreateProblemResponse(problem.getProblemId()))
                        .build());
    }

    @GetMapping("/{problemId}/published-submissions")
    public ResponseEntity<List<PublicSubmission>> getPublicSubmissions(
            @PathVariable @Parameter(example = "add-two-numbers") String problemId) {
        List<PublicSubmission> publicSubmissions = this.submissionsService.getPublicSubmissions(problemId);
        return ResponseEntity.ok(publicSubmissions);
    }
}
