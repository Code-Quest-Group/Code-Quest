package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TokenRefreshResponse {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("token_type")
    private String tokenType = "Bearer";

    public TokenRefreshResponse(String accessToken, @NotBlank String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
