package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Data
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "serial_id")
    private Long serialId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false, name = "expiry_date")
    private Instant expiryDate;
}
