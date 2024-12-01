package pl.agh.edu.wi.informatyka.codequest.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name = "user_preferences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPreferences {

    @JsonIgnore
    @JsonProperty("user_id")
    @Id
    @Column(name = "user_id")
    private String userId;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "dark_mode", nullable = false)
    private Boolean darkMode = false;

    @Column(name = "is_profile_public", nullable = false)
    private Boolean isProfilePublic = true;

    @Column(name = "language", nullable = false)
    private String language = "en";

    @Column(name = "timezone", nullable = false)
    private String timezone = "UTC";

    public static UserPreferences createNullPreferences() {
        return new UserPreferences(null, null, null, null, null, null);
    }
}
