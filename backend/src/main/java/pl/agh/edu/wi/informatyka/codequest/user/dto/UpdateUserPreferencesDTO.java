package pl.agh.edu.wi.informatyka.codequest.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Data
public class UpdateUserPreferencesDTO {

    @Schema(hidden = true)
    @JsonIgnore
    private User user;

    @JsonProperty("dark_mode")
    private Boolean darkMode;

    @JsonProperty("is_profile_public")
    private Boolean isProfilePublic = true;

    private String language;

    private String timezone;
}
