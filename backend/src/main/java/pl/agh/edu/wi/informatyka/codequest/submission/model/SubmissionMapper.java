package pl.agh.edu.wi.informatyka.codequest.submission.model;

import java.time.ZonedDateTime;

public class SubmissionMapper {
    private SubmissionMapper() {}

    public static Submission createEntityFromDto(CreateSubmissionDTO dto) {
        Submission entity = new Submission();
        entity.setCreatedAt(ZonedDateTime.now());
        entity.setProblemId(dto.getProblemId());
        entity.setLanguage(dto.getLanguage());
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
