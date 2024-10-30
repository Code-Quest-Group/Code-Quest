package pl.agh.edu.wi.informatyka.codequest.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_shouldReturn201_whenValidRequest() throws Exception {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("test@example.com", "testuser", "password");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerUserDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.user_id").exists());
    }

    @Test
    void register_shouldReturn409_whenUserAlreadyExists() throws Exception {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("existing@example.com", "existinguser", "password");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerUserDTO)));

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerUserDTO)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User already exists: Email already exists."));
    }

    @Test
    void login_shouldReturn200_whenValidCredentials() throws Exception {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO("testlogin@example.com", "testloginuser", "password");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerUserDTO)));

        LoginUserDTO loginUserDTO = new LoginUserDTO("testlogin@example.com", "password");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    void login_shouldReturn401_whenInvalidCredentials() throws Exception {
        LoginUserDTO loginUserDTO = new LoginUserDTO("nonexistent@example.com", "wrongpassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUserDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_shouldReturn401_whenPasswordIsWrong() throws Exception {
        RegisterUserDTO registerUserDTO =
                new RegisterUserDTO("wrongpassword@example.com", "wrongpassworduser", "correctpassword");

        // Register the user
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerUserDTO)));

        LoginUserDTO loginUserDTO = new LoginUserDTO("wrongpassword@example.com", "wrongpassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginUserDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }
}
