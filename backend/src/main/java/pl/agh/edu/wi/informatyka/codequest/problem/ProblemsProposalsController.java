package pl.agh.edu.wi.informatyka.codequest.problem;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.ProblemProposalDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@RestController()
@RequestMapping("/problems")
@Tag(name = "Problems")
public class ProblemsProposalsController {
    private final ProblemsService problemsService;
    private final ProblemProposalsService problemProposalsService;

    public ProblemsProposalsController(
            ProblemsService problemsService, ProblemProposalsService problemProposalsService) {
        this.problemsService = problemsService;
        this.problemProposalsService = problemProposalsService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("proposals")
    public List<Problem> getAllProblemsProposals(@AuthenticationPrincipal User user) {
        return problemProposalsService.getAllPending();
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("proposals/{userId}")
    public List<Problem> getUserProblemsProposals(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        return problemProposalsService.getAllByUser(user.getUserId());
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("proposals")
    @Operation(summary = "Create new Problem Proposal", security = @SecurityRequirement(name = "bearerAuth"))
    public String createCodeTemplate(
            @Valid @RequestBody ProblemProposalDTO problemProposalDTO, @AuthenticationPrincipal User user) {
        problemProposalDTO.setAuthor(user);
        this.problemProposalsService.createProblemProposal(problemProposalDTO);
        return "ok";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("proposals/{problemId}/approve")
    @Operation(summary = "Create new Problem Proposal", security = @SecurityRequirement(name = "bearerAuth"))
    public String approveProblemProposal(
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String problemId) {
        this.problemProposalsService.approveProblem(problemId);
        return "ok";
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("proposals/{problemId}/reject")
    @Operation(summary = "Create new Problem Proposal", security = @SecurityRequirement(name = "bearerAuth"))
    public String rejectProblemProposal(
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String problemId) {
        this.problemProposalsService.rejectProblem(problemId);
        return "ok";
    }
}
