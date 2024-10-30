package pl.agh.edu.wi.informatyka.codequest.auth;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.auth.model.AuthResponseDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.util.GenericResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = null;
    }

    @PostMapping("/register")
    public ResponseEntity<GenericResponse<?>> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        User user = authService.registerUser(registerUserDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GenericResponse.builder()
                        .success(true)
                        .message("User registered successfully")
                        .data(Map.of("user_id", user.getUserId()))
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<GenericResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        try {
            User user = authService.authenticate(loginUserDTO);

            String token = jwtUtil.generateToken(user.getUserId());
            return ResponseEntity.ok(GenericResponse.<AuthResponseDTO>builder()
                    .data(new AuthResponseDTO(token))
                    .success(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(GenericResponse.<AuthResponseDTO>builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<String>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(GenericResponse.<String>builder()
                        .success(false)
                        .message("User already exists: " + ex.getMessage())
                        .build());
    }
}
