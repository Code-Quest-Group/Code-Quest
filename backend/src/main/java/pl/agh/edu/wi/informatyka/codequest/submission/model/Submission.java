package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("submission_id")
    private long submissionId;

    @JsonProperty("user_code")
    private String userCode;

    @JsonIgnore
    @JsonProperty("user_id")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @JsonIgnore
    @JsonProperty("problem_id")
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    Problem problem;

    @Enumerated(EnumType.STRING)
    Language language;

    @Column(name = "submission_status")
    @Enumerated(EnumType.STRING)
    SubmissionStatus status;

    // internal token - id used by judge0
    String token;

    @JsonProperty("correct_testcases")
    @Column(name = "correct_testcases")
    Integer correctTestcases;

    @JsonProperty("total_testcases")
    @Column(name = "total_testcases")
    Integer totalTestcases;

    @JsonProperty("error_message")
    @Column(name = "error_message", columnDefinition = "TEXT")
    String errorMessage;

    @JsonProperty("created_at")
    @Column(name = "created_at", updatable = false)
    ZonedDateTime createdAt;

    @JsonProperty("finished_at")
    @Column(name = "finished_at")
    ZonedDateTime finishedAt;

    @Column(columnDefinition = "MEDIUMTEXT")
    String stdout;

    @Column(columnDefinition = "MEDIUMTEXT")
    String stderr;

    Float time;
    Float memory;

    public Submission() {
        this.createdAt = ZonedDateTime.now();
    }

    @JsonProperty("problem_id")
    public String getProblemId() {
        return (problem != null) ? problem.getProblemId() : null;
    }

    @JsonProperty("user_id")
    public String getUserId() {
        return this.getUser().getUserId();
    }
}
