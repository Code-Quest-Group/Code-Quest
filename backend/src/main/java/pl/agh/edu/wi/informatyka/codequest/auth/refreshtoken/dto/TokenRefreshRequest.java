package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TokenRefreshRequest {
    @NotBlank
    private String refreshToken;
}
