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
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.SubmissionResultDTO;

@RestController
@RequestMapping("/submissions")
@Tag(name = "Submission")
public class SubmissionsController {
    private static final String EXAMPLE_REQUEST_JSON =
            """
             {
                 \"sourceCode\": \"class Problem:\\n    def solve(self, a, b):\\n        return a + b\\n\\n\",
                 \"problemId\": \"1\",
                 \"language\": \"PYTHON\"
             }\
             """;

    private final SubmissionsService submissionsService;

    public SubmissionsController(SubmissionsService submissionsService) {
        this.submissionsService = submissionsService;
    }

    @Operation(summary = "Get submission by ID")
    @GetMapping("/{submissionId}")
    @ApiResponse(
            responseCode = "200",
            description = "Submission run and finished successfully ",
            content = @Content(schema = @Schema(implementation = SubmissionResultDTO.class)))
    @ApiResponse(responseCode = "401", description = "Submission invalid")
    public String getSubmission(
            @PathVariable @Parameter(example = "576d8010-c8a1-4e08-9bc6-400da4f22c99") String submissionId) {
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
    public String submitSubmission(
            @Valid
                    @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = EXAMPLE_REQUEST_JSON)))
                    @RequestBody
                    CreateSubmissionDTO requestBody)
            throws IOException {
        String token = submissionsService.submitSubmission(requestBody);
        System.out.println("token: " + token);
        return token;
    }
}
