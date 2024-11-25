package pl.agh.edu.wi.informatyka.codequest.submission.model;

import java.util.UUID;
import org.springframework.stereotype.Component;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateCustomSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.CreateSubmissionDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;

@Component
public class SubmissionMapper {
    private final ProblemsRepository problemsRepository;

    private SubmissionMapper(ProblemsRepository problemsRepository) {
        this.problemsRepository = problemsRepository;
    }

    public Submission createEntityFromDto(CreateSubmissionDTO dto) {
        Submission entity = new Submission();
        Problem problem = this.problemsRepository
                .findById(dto.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + dto.getProblemId()));

        entity.setProblem(problem);
        entity.setLanguage(dto.getLanguage());
        entity.setUser(dto.getUser());
        entity.setUserCode(dto.getSourceCode());
        entity.setStatus(SubmissionStatus.PROCESSING);

        return entity;
    }

    public CustomSubmission createCustomSubmissionFromDto(CreateCustomSubmissionDTO dto) {
        CustomSubmission entity = new CustomSubmission();
        Problem problem = this.problemsRepository
                .findById(dto.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + dto.getProblemId()));

        entity.setProblem(problem);
        entity.setProblemId(dto.getProblemId());
        entity.setLanguage(dto.getLanguage());
        entity.setUser(dto.getUser());
        entity.setUserId(dto.getUser().getUserId());
        entity.setUserCode(dto.getSourceCode());
        entity.setStatus(SubmissionStatus.PROCESSING);
        entity.setSubmissionId("custom_submission_" + UUID.randomUUID());

        return entity;
    }

    public void updateEntityFromDto(Submission entity, Judge0SubmissionResultDTO dto) {
        entity.setErrorMessage(dto.getMessage());
        entity.setFinishedAt(dto.getFinishedAt());
        entity.setTime(dto.getTime());
        entity.setMemory(dto.getMemory());
        entity.setStatus(SubmissionStatus.fromId(dto.getJudge0Status().getId()));
        entity.setStderr(dto.getStderr());
    }
}
