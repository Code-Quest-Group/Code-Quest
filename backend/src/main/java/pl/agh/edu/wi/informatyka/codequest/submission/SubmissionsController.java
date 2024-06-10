package pl.agh.edu.wi.informatyka.codequest.submission;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
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
                 "sourceCode": "#include <stdio.h>\\nint main(void) {\\nchar name[10];\\nscanf(\\"%%s\\", name);\\nprintf(\\"hello %%s\\n\\", name);\\nreturn 0;}",
                 "problemId": "1",
                 "language": "PYTHON",
                 "stdin": "world"
             }
             """;

    private final SubmissionsService submissionsService;

    public SubmissionsController(SubmissionsService submissionsService) {
        this.submissionsService = submissionsService;
    }

    @Operation(summary = "Get submission by ID")
    @GetMapping("/{id}")
    @ApiResponse(
            responseCode = "200",
            description = "Submission run and finished successfully ",
            content = @Content(schema = @Schema(implementation = SubmissionResultDTO.class)))
    @ApiResponse(responseCode = "401", description = "Submission invalid")
    public Object getSubmission(@PathVariable @Parameter(example = "576d8010-c8a1-4e08-9bc6-400da4f22c99") String id) {
        return "Get submission with ID: " + id;
    }

    @Operation(summary = "Submit new submission")
    @PostMapping("/")
    @ApiResponse(
            responseCode = "201",
            description = "Created",
            content =
                    @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"token\": \"576d8010-c8a1-4e08-9bc6-400da4f22c99\"}")))
    public Map<String, String> submitSubmission(
            @Valid
                    @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            content = @Content(schema = @Schema(example = EXAMPLE_REQUEST_JSON)))
                    @RequestBody
                    CreateSubmissionDTO requestBody) {
        String token = submissionsService.submitSubmission(requestBody);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
}
