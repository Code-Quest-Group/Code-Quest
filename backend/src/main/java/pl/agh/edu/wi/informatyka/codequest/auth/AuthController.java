package pl.agh.edu.wi.informatyka.codequest.auth;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.auth.model.AuthResponseDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;
import pl.agh.edu.wi.informatyka.codequest.util.ResponseStatus;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<GenericResponse<?>> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        User user = authService.registerUser(registerUserDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GenericResponse.builder()
                        .status(ResponseStatus.OK)
                        .message("User registered successfully")
                        .data(Map.of("user_id", user.getUserId()))
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<GenericResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        try {
            User user = authService.authenticate(loginUserDTO);

            String token = authService.generateJWTToken(user);
            return ResponseEntity.ok(GenericResponse.<AuthResponseDTO>builder()
                    .data(new AuthResponseDTO(token))
                    .status(ResponseStatus.OK)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(GenericResponse.<AuthResponseDTO>builder()
                            .status(ResponseStatus.ERROR)
                            .message(e.getMessage())
                            .build());
        }
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<String>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(GenericResponse.<String>builder()
                        .status(ResponseStatus.ERROR)
                        .message("User already exists: " + ex.getMessage())
                        .build());
    }
}
