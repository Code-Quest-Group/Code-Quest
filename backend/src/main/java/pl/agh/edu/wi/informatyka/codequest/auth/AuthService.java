package pl.agh.edu.wi.informatyka.codequest.auth;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.auth.jwt.JwtUtil;
import pl.agh.edu.wi.informatyka.codequest.auth.model.AuthResponseDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.LoginUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.model.RegisterUserDTO;
import pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.RefreshTokenService;
import pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.model.RefreshToken;
import pl.agh.edu.wi.informatyka.codequest.user.UserRepository;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.user.model.UserPreferences;

@Service
public class AuthService {

    Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    private final RefreshTokenService refreshTokenService;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            BCryptPasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
    }

    public User registerUser(RegisterUserDTO registerUserDTO) {
        String passwordHash = passwordEncoder.encode(registerUserDTO.getPassword());

        if (userRepository.existsByEmail(registerUserDTO.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists.");
        }

        if (userRepository.existsByUsername(registerUserDTO.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists.");
        }

        User user = new User();
        user.setEmail(registerUserDTO.getEmail());
        user.setUsername(registerUserDTO.getUsername());
        user.setPasswordHash(passwordHash);
        UserPreferences userPreferences = new UserPreferences();
        userPreferences.setUser(user);
        user.setPreferences(userPreferences);
        user = userRepository.save(user);
        logger.info("New user created user_id: {}, email: {}", user.getUsername(), user.getEmail());
        return user;
    }

    public User authenticate(LoginUserDTO loginUserDTO) {
        User user = userRepository
                .findByEmailOrUsername(loginUserDTO.getUsernameOrEmail(), loginUserDTO.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // for Google oauth2 users password is null
        if (user.getPasswordHash() == null) {
            throw new RuntimeException("Invalid credentials");
        }

        if (passwordEncoder.matches(loginUserDTO.getPassword(), user.getPasswordHash())) {
            logger.info("User {} successfully authenticated", user.getUserId());
            user.setLastLogin(LocalDateTime.now());
            user = userRepository.save(user);
            return user;
        } else {
            logger.info("User {} failed to authenticate", user.getUserId());
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User loginOrRegisterGoogleUser(String userId, String email, String name) {
        User user = userRepository.findById(userId).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name);
            newUser.setUserId(userId);
            newUser.setEnabled(true);
            newUser = userRepository.save(newUser);
            logger.info("New google user registered {} {}", userId, email);
            return newUser;
        });
        user.setLastLogin(LocalDateTime.now());
        user = userRepository.save(user);
        logger.info("Google user logged in {} {}", userId, email);
        return user;
    }

    public String generateJWTToken(User user) {
        return jwtUtil.generateToken(user);
    }

    public AuthResponseDTO getAuthResponse(User user) {
        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setUsername(user.getUsername());
        authResponseDTO.setUserId(user.getUserId());
        authResponseDTO.setRole(user.getUserRole().name());
        authResponseDTO.setActive(true); // TODO implement account activation by email
        authResponseDTO.setBanned(user.isBanned());

        String token = jwtUtil.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        authResponseDTO.setToken(token);
        authResponseDTO.setRefreshToken(refreshToken.getToken());

        return authResponseDTO;
    }
}
