package pl.agh.edu.wi.informatyka.codequest.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;
import pl.agh.edu.wi.informatyka.codequest.user.UserRepository;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    private RegisterUserDTO registerUserDTO;
    private LoginUserDTO loginUserDTO;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        registerUserDTO = new RegisterUserDTO("test@example.com", "username", "password");
        loginUserDTO = new LoginUserDTO("username", "password");
        user = new User();
        user.setUserId("userId");
        user.setEmail(registerUserDTO.getEmail());
        user.setUsername(registerUserDTO.getUsername());
        user.setPasswordHash("hashedPassword");
    }

    @Test
    void registerUser_shouldRegisterNewUser() {
        when(userRepository.existsByEmail(registerUserDTO.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(registerUserDTO.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(registerUserDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = authService.registerUser(registerUserDTO);

        assertNotNull(registeredUser);
        assertEquals("test@example.com", registeredUser.getEmail());
        assertEquals("username", registeredUser.getUsername());
        assertEquals("hashedPassword", registeredUser.getPasswordHash());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_shouldThrowException_whenEmailExists() {
        when(userRepository.existsByEmail(registerUserDTO.getEmail())).thenReturn(true);

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> {
            authService.registerUser(registerUserDTO);
        });

        assertEquals("Email already exists.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_shouldThrowException_whenUsernameExists() {
        when(userRepository.existsByEmail(registerUserDTO.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(registerUserDTO.getUsername())).thenReturn(true);

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> {
            authService.registerUser(registerUserDTO);
        });

        assertEquals("Username already exists.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void authenticate_shouldReturnUser_whenCredentialsAreValid() {
        when(userRepository.findByEmailOrUsername(loginUserDTO.getUsernameOrEmail(), loginUserDTO.getUsernameOrEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(loginUserDTO.getPassword(), user.getPasswordHash()))
                .thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User authenticatedUser = authService.authenticate(loginUserDTO);

        assertNotNull(authenticatedUser);
        assertEquals("userId", authenticatedUser.getUserId());
        verify(userRepository, times(1)).findByEmailOrUsername(any(String.class), any(String.class));
    }

    @Test
    void authenticate_shouldThrowException_whenCredentialsAreInvalid() {
        when(userRepository.findByEmailOrUsername(loginUserDTO.getUsernameOrEmail(), loginUserDTO.getUsernameOrEmail()))
                .thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.authenticate(loginUserDTO);
        });

        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void loginOrRegisterGoogleUser_shouldReturnUser_whenUserExists() {
        User googleUser = new User();
        googleUser.setUserId("google-user-id");
        googleUser.setEmail("test@example.com");
        googleUser.setUsername("name");

        when(userRepository.findById("google-user-id")).thenReturn(Optional.of(googleUser));
        when(userRepository.save(any(User.class))).thenReturn(googleUser);
        User newGoogleUser = authService.loginOrRegisterGoogleUser("google-user-id", "test@example.com", "name");

        assertEquals("google-user-id", newGoogleUser.getUserId());
        verify(userRepository, atMost(1)).save(any(User.class));
    }

    @Test
    void loginOrRegisterGoogleUser_shouldRegisterNewUser_whenUserDoesNotExist() {
        when(userRepository.findById("google-user-id")).thenReturn(Optional.empty());
        User googleUser = new User();
        googleUser.setUserId("google-user-id");
        googleUser.setEmail("test@example.com");
        googleUser.setUsername("name");

        when(userRepository.save(any(User.class))).thenReturn(googleUser);

        User savedGoogleUser = authService.loginOrRegisterGoogleUser("google-user-id", "test@example.com", "name");

        assertNotNull(savedGoogleUser);
        assertEquals("google-user-id", savedGoogleUser.getUserId());
        verify(userRepository, atMost(2)).save(any(User.class));
    }

    @Test
    void generateJWTToken_shouldReturnToken() {
        String token = "jwt-token";
        when(jwtUtil.generateToken(user.getUserId())).thenReturn(token);

        String generatedToken = authService.generateJWTToken(user);

        assertEquals(token, generatedToken);
    }
}
