package pl.agh.edu.wi.informatyka.codequest.submissionlogs.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import pl.agh.edu.wi.informatyka.codequest.submission.model.SubmissionType;

@Data
@Entity
@Table(name = "submission_logs")
@NoArgsConstructor
public class SubmissionLog {
    @Id
    @JsonProperty("submission_id")
    private String submissionId;

    @JsonProperty("user_id")
    @Column(nullable = false)
    private String userId;

    private String token;

    @JsonProperty("submission_type")
    @Enumerated(EnumType.STRING)
    SubmissionType submissionType;

    @JsonProperty("created_at")
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    Instant createdAt;

    public SubmissionLog(String submissionId, String userId, String token, SubmissionType submissionType) {
        this.submissionId = submissionId;
        this.userId = userId;
        this.token = token;
        this.submissionType = submissionType;
        createdAt = Instant.now();
    }
}
