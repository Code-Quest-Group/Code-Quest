package pl.agh.edu.wi.informatyka.codequest.submissionlogs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.dto.SubmissionLogQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;

@RestController
@RequestMapping("/logs")
public class SubmissionLogsController {
    private final SubmissionLogsRepository submissionLogsRepository;

    public SubmissionLogsController(SubmissionLogsRepository submissionLogsRepository) {
        this.submissionLogsRepository = submissionLogsRepository;
    }

    @GetMapping("/submissions")
    @PreAuthorize("hasRole('ROLE_MODERATOR')")
    @Operation(
            summary = "Get submission logs",
            description = "This endpoint is accessible by MODERATOR role.",
            security = @SecurityRequirement(name = "adminBearerAuth"))
    public List<SubmissionLog> getSubmissionLogs(@ModelAttribute SubmissionLogQueryDTO query) {
        Specification<SubmissionLog> spec = SubmissionLogSpecification.buildSpecification(query);

        return this.submissionLogsRepository.findAll(spec);
    }
}
