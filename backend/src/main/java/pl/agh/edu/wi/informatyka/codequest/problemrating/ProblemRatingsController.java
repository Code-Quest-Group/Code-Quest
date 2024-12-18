package pl.agh.edu.wi.informatyka.codequest.problemrating;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.edu.wi.informatyka.codequest.problemrating.dto.CreateProblemRatingDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@RestController
@Tag(name = "Problem Ratings")
public class ProblemRatingsController {
    private final ProblemRatingsService problemRatingsService;

    public ProblemRatingsController(ProblemRatingsService problemRatingsService) {
        this.problemRatingsService = problemRatingsService;
    }

    @Operation(description = "Rate a problem from 1 to 5", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/problems/{problemId}/ratings")
    public ResponseEntity<?> rateProblem(
            @PathVariable @Parameter(example = "add-two-numbers") String problemId,
            @Valid @RequestBody CreateProblemRatingDTO ratingDTO,
            @AuthenticationPrincipal User user) {
        problemRatingsService.saveOrUpdateRating(user.getUserId(), problemId, ratingDTO.getRating());
        return ResponseEntity.ok("ok");
    }
}
