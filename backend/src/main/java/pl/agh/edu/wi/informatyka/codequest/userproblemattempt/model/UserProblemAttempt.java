package pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "serial_id")
    private Long serialId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonProperty("user_id")
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @JsonProperty("problem_id")
    @Column(name = "problem_id", insertable = false, updatable = false)
    private String problemId;

    @JsonProperty("user_problem_status")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserProblemStatus status;

    @JsonProperty("submission_count")
    @Column(name = "submission_count", nullable = false)
    private int submissionCount = 0;

    @JsonProperty("last_submission_time")
    @Column(name = "last_submission_time")
    private ZonedDateTime lastSubmissionTime;

    public static UserProblemAttempt fromSubmission(Submission submission) {
        UserProblemAttempt userProblemAttempt = new UserProblemAttempt();
        userProblemAttempt.setUser(submission.getUser());
        userProblemAttempt.setUserId(submission.getUserId());
        userProblemAttempt.setProblem(submission.getProblem());
        userProblemAttempt.setProblemId(submission.getProblemId());
        userProblemAttempt.setStatus(
                submission.getStatus() == SubmissionStatus.ACCEPTED
                        ? UserProblemStatus.SUCCEEDED
                        : UserProblemStatus.ATTEMPTED);
        userProblemAttempt.setLastSubmissionTime(submission.getFinishedAt());

        return userProblemAttempt;
    }
}
