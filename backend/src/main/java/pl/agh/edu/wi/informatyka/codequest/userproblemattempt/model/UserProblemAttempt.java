package pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.submission.model.SubmissionStatus;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Entity
@Table(name = "user_problem_attempts")
@Data
public class UserProblemAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "serial_id")
    private Long serialId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "problem_id", insertable = false, updatable = false)
    private String problemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserProblemStatus status;

    @Column(name = "submission_count", nullable = false)
    private int submissionCount = 0;

    @Column(name = "last_submission_time")
    private ZonedDateTime lastSubmissionTime;

    public static UserProblemAttempt fromSubmission(Submission submission) {
        UserProblemAttempt userProblemAttempt = new UserProblemAttempt();
        userProblemAttempt.setUser(submission.getUser());
        userProblemAttempt.setProblem(submission.getProblem());
        userProblemAttempt.setStatus(
                submission.getStatus() == SubmissionStatus.ACCEPTED
                        ? UserProblemStatus.SUCCEEDED
                        : UserProblemStatus.ATTEMPTED);
        userProblemAttempt.setLastSubmissionTime(submission.getFinishedAt());

        return userProblemAttempt;
    }
}
