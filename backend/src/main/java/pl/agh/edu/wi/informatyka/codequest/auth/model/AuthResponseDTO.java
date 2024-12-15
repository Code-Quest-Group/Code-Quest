package pl.agh.edu.wi.informatyka.codequest.auth.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;

    @JsonProperty("refresh_token")
    private String refreshToken;

    private String userId;

    private String username;

    private String role;

    private boolean active;

    private boolean banned;
}
