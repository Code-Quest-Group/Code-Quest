package pl.agh.edu.wi.informatyka.codequest.submission.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;

@Getter
public class SubmissionJudgedEvent extends ApplicationEvent {
    private final Submission submission;

    public SubmissionJudgedEvent(Object source, Submission submission) {
        super(source);
        this.submission = submission;
    }
}
