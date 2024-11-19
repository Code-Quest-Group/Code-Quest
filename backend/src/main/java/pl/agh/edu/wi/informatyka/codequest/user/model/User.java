package pl.agh.edu.wi.informatyka.codequest.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;

@Data
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id", length = 36, nullable = false, unique = true)
    private String userId;

    @Column(unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "user_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role userRole;

    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "full_name")
    private String fullName;

    private String country;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(nullable = false)
    @JsonIgnore()
    private boolean enabled;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore()
    private List<Submission> submissions;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.enabled = false;
    }

    @PrePersist
    protected void onCreate() {
        if (userId == null) {
            userId = UUID.randomUUID().toString();
        }

        if (userRole == null) {
            userRole = Role.USER;
        }
    }

    @Override
    public String toString() {
        return "User{" + "userId='"
                + userId + '\'' + ", username='"
                + username + '\'' + ", email='"
                + email + '\'' + ", lastLogin="
                + lastLogin + ", createdAt="
                + createdAt + '}';
    }
}
