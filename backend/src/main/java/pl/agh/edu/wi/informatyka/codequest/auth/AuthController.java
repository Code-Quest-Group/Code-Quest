package pl.agh.edu.wi.informatyka.codequest.auth;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

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
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        User user = authService.registerUser(registerUserDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("user_id", user.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        try {
            User user = authService.authenticate(loginUserDTO);

            String token = jwtUtil.generateToken(user.getUserId());
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists: " + ex.getMessage());
    }
}
