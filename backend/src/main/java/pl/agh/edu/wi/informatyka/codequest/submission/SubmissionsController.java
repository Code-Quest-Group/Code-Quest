package pl.agh.edu.wi.informatyka.codequest.submission;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.*;
import pl.agh.edu.wi.informatyka.codequest.submission.model.CustomSubmission;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.user.model.Role;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.DataExamples;

@RestController
@RequestMapping("/submissions")
@Tag(name = "Submission")
public class SubmissionsController {
    private final SubmissionsService submissionsService;

    public SubmissionsController(SubmissionsService submissionsService) {
        this.submissionsService = submissionsService;
    }

    @Operation(summary = "Publish submission", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/{submissionId}/publish")
    public void publishSubmission(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String submissionId) {
        Submission submission = this.submissionsService.getSubmissionOrThrow(submissionId);
        if (!submission.getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to this resource");
        }
        this.submissionsService.publishSubmission(submission);
    }

    @Operation(summary = "Get submission by ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping()
    @ApiResponse(
            responseCode = "200",
            description = "Submission run and finished successfully ",
            content = @Content(schema = @Schema(implementation = Submission.class)))
    @ApiResponse(responseCode = "401", description = "Submission invalid")
    public List<Submission> getSubmissions(
            @AuthenticationPrincipal User user, @ModelAttribute SubmissionQueryDTO submissionQueryDTO) {
        if (user.getUserRole() != Role.ADMIN) {
            submissionQueryDTO.setUserId(user.getUserId());
        }
        return submissionsService.getSubmissions(submissionQueryDTO);
    }

    @Operation(summary = "Get test submission by ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/custom/{submission_id}")
    @ApiResponse(
            responseCode = "200",
            description = "Submission run and finished successfully ",
            content = @Content(schema = @Schema(implementation = CustomSubmission.class)))
    @ApiResponse(responseCode = "401", description = "Submission invalid")
    public CustomSubmission getCustomSubmission(
            @AuthenticationPrincipal User user, @PathVariable("submission_id") String submissionId) {
        CustomSubmissionQueryDTO customSubmissionQueryDTO = new CustomSubmissionQueryDTO(submissionId, user);
        return submissionsService.getCustomSubmission(customSubmissionQueryDTO);
    }

    @Operation(summary = "Submit new submission", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping(value = "/", consumes = "application/json", produces = "application/json")
    @ApiResponse(
            responseCode = "201",
            description = "Created",
            content =
                    @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"submission_id\": \"44326\"}")))
    public ResponseEntity<?> submitSubmission(
            @AuthenticationPrincipal User user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            content =
                                    @Content(
                                            mediaType = "application/json",
                                            examples = {
                                                @ExampleObject(
                                                        name = "[AddTwo] Valid Solution",
                                                        value = DataExamples.AddTwo.VALID_SOLUTION),
                                                @ExampleObject(
                                                        name = "[AddTwo] One wrong Solution",
                                                        value = DataExamples.AddTwo.ONE_WRONG_SOLUTION),
                                                @ExampleObject(
                                                        name = "[AddTwo] Random fail solution",
                                                        value = DataExamples.AddTwo.RANDOM_FAIL),
                                                @ExampleObject(
                                                        name = "[AddTwo] Invalid Solution",
                                                        value = DataExamples.AddTwo.INVALID_SOLUTION),
                                                @ExampleObject(
                                                        name = "[AddTwo] Infinite Loop (timeout)",
                                                        value = DataExamples.AddTwo.INFINITE_LOOP),
                                                @ExampleObject(
                                                        name = "[NthFibonacci] Valid Solution",
                                                        value = DataExamples.NthFibonacci.VALID_SOLUTION),
                                                @ExampleObject(
                                                        name = "[NthFibonacci] Invalid Solution",
                                                        value = DataExamples.NthFibonacci.INVALID_SOLUTION),
                                            }))
                    @Valid
                    @RequestBody
                    CreateSubmissionDTO submissionDTO) {
        submissionDTO.setUser(user);
        String submissionId = submissionsService.submitSubmission(submissionDTO);
        return ResponseEntity.ok(Collections.singletonMap("submission_id", submissionId));
    }

    @Operation(summary = "Submit new custom submission", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/custom")
    public ResponseEntity<?> submitCustomSubmission(
            @AuthenticationPrincipal User user, @RequestBody CreateCustomSubmissionDTO submissionDTO) {
        submissionDTO.setUser(user);
        String submissionId = submissionsService.submitCustomSubmission(submissionDTO);
        return ResponseEntity.ok(Collections.singletonMap("submission_id", submissionId));
    }
}
