package pl.agh.edu.wi.informatyka.codequest.judge0;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;

@RestController
@Tag(name = "Judge0")
public class Judge0Controller {

    private final Judge0Service judge0Service;

    public Judge0Controller(Judge0Service judge0Service) {
        this.judge0Service = judge0Service;
    }

    @Operation(summary = "webhook received from Judge0 to signal a given job has finished")
    @PutMapping(value = "/judge0/webhook")
    public void submitWebhook(@RequestBody Judge0SubmissionResultDTO submission) {
        this.judge0Service.handleSubmissionWebhook(submission);
    }
}
