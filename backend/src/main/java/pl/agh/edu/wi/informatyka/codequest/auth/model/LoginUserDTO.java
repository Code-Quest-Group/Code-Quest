package pl.agh.edu.wi.informatyka.codequest.auth.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUserDTO {
    @JsonProperty("username_or_email")
    @NotBlank
    private String usernameOrEmail;

    @NotBlank
    private String password;
}
