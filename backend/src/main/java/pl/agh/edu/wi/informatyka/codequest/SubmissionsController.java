package pl.agh.edu.wi.informatyka.codequest;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubmissionsController {

    private final SubmissionsService submissionsService;

    public SubmissionsController(SubmissionsService submissionsService) {
        this.submissionsService = submissionsService;
    }

    @PostMapping("/submissions")
    public String handleSubmissionRequest(@NotBlank @RequestBody String requestBody) {
        return submissionsService.submitCode(requestBody);
    }
}
