package pl.agh.edu.wi.informatyka.codequest.submission.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import pl.agh.edu.wi.informatyka.codequest.submission.dto.Judge0SubmissionResultDTO;

@Getter
public class SubmissionExecutionCompletedEvent extends ApplicationEvent {
    private final Judge0SubmissionResultDTO submissionResult;

    public SubmissionExecutionCompletedEvent(Object source, Judge0SubmissionResultDTO submissionResult) {
        super(source);
        this.submissionResult = submissionResult;
    }
}
