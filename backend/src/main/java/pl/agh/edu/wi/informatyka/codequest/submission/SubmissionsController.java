package pl.agh.edu.wi.informatyka.codequest.submission;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.Collections;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.submission.model.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Judge0SubmissionResultDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.util.DataExamples;

@RestController
@RequestMapping("/submissions")
@Tag(name = "Submission")
public class SubmissionsController {
    private final SubmissionsService submissionsService;

    public SubmissionsController(SubmissionsService submissionsService) {
        this.submissionsService = submissionsService;
    }

    @Operation(summary = "Get submission by ID")
    @GetMapping("/{submissionId}")
    @ApiResponse(
            responseCode = "200",
            description = "Submission run and finished successfully ",
            content = @Content(schema = @Schema(implementation = Submission.class)))
    @ApiResponse(responseCode = "401", description = "Submission invalid")
    public Submission getSubmission(@PathVariable @Parameter(example = "678345435") Long submissionId) {
        return submissionsService.getSubmission(submissionId);
    }

    @Operation(summary = "Submit new submission")
    @PostMapping(value = "/", consumes = "application/json", produces = "application/json")
    @ApiResponse(
            responseCode = "201",
            description = "Created",
            content =
                    @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"token\": \"576d8010-c8a1-4e08-9bc6-400da4f22c99\"}")))
    public ResponseEntity<?> submitSubmission(
            @Valid
                    @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            content =
                                    @Content(
                                            mediaType = "application/json",
                                            examples = {
                                                @ExampleObject(
                                                        name = "[AddTwo] Valid Solution",
                                                        value = DataExamples.AddTwo.VALID_SOLUTION),
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
                    @RequestBody
                    CreateSubmissionDTO requestBody)
            throws IOException {
        long submissionId = submissionsService.submitSubmission(requestBody);
        return ResponseEntity.ok(Collections.singletonMap("submission_id", submissionId));
    }

    @Operation(summary = "webhook received from Judge0 to signal a given job has finished")
    @PutMapping(value = "/webhook")
    public void submitWebhook(@RequestBody Judge0SubmissionResultDTO submission) {
        this.submissionsService.handleSubmissionWebhook(submission);
    }
}
