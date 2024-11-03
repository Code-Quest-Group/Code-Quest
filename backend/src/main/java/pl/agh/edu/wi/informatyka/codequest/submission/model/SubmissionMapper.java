package pl.agh.edu.wi.informatyka.codequest.submission.model;

import org.springframework.stereotype.Component;
import pl.agh.edu.wi.informatyka.codequest.problem.Problem;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;

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

    public static Submission updateEntityFromDto(Submission entity, Judge0SubmissionResultDTO dto) {
        entity.setStatus(SubmissionStatus.fromId(dto.getJudge0Status().id));
        entity.setErrorMessage(dto.getMessage());
        entity.setFinishedAt(dto.getFinishedAt());
        entity.setTime(dto.getTime());
        entity.setMemory(dto.getMemory());
        entity.setStdout(dto.getStdout());
        entity.setStderr(dto.getStderr());

        return entity;
    }
}
