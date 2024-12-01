package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.Data;
import org.apache.commons.lang3.builder.HashCodeExclude;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @JsonProperty("submission_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String submissionId;

    @JsonProperty("user_code")
    private String userCode;

    @JsonIgnore
    @ManyToOne
    @HashCodeExclude
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @JsonProperty("user_id")
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId;

    @JsonIgnore
    @ManyToOne
    @HashCodeExclude
    @JoinColumn(name = "problem_id", nullable = false)
    Problem problem;

    @JsonProperty("problem_id")
    @Column(name = "problem_id", insertable = false, updatable = false)
    private String problemId;

    @Enumerated(EnumType.STRING)
    Language language;

    @Column(name = "submission_status")
    @Enumerated(EnumType.STRING)
    SubmissionStatus status;

    // internal token - id used by judge0
    @JsonIgnore
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
    Instant createdAt;

    @JsonProperty("updated_at")
    @Column(name = "updated_at")
    Instant updatedAt;

    @JsonProperty("finished_at")
    @Column(name = "finished_at")
    Instant finishedAt;

    @JsonIgnore
    @Column(columnDefinition = "MEDIUMTEXT")
    String stdout;

    @Column(columnDefinition = "MEDIUMTEXT")
    String stderr;

    Float time;
    Float memory;

    @Column(name = "is_public", nullable = false)
    @JsonIgnore()
    private boolean isPublic = false;

    public Submission() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = Instant.now();
    }

    @Override
    public String toString() {
        return "Submission{" + "submissionId='"
                + submissionId + '\'' + ", userId="
                + user.getUserId() + ", problemId="
                + problem.getProblemId() + ", language="
                + language + ", status="
                + status + ", createdAt="
                + createdAt + '}';
    }
}
