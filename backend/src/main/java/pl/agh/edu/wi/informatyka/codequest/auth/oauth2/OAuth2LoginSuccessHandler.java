package pl.agh.edu.wi.informatyka.codequest.auth.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import pl.agh.edu.wi.informatyka.codequest.auth.AuthService;
import pl.agh.edu.wi.informatyka.codequest.auth.model.AuthResponseDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    public OAuth2LoginSuccessHandler(AuthService authService, ObjectMapper objectMapper) {
        this.authService = authService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String userId = "google-" + oAuth2User.getAttribute("sub");
        oAuth2User.getAttributes();

        User user = authService.loginOrRegisterGoogleUser(userId, email, name);

        GenericResponse<AuthResponseDTO> genericResponse = GenericResponse.<AuthResponseDTO>builder()
                .data(authService.getAuthResponse(user))
                .status(ResponseStatus.OK)
                .build();

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_OK);
        String jsonResponse = objectMapper.writeValueAsString(genericResponse);
        response.getWriter().write(jsonResponse);
    }
}
