package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken;

import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.auth.jwt.JwtProperties;
import pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.exception.TokenRefreshException;
import pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.model.RefreshToken;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Service
public class RefreshTokenService {
    private final JwtProperties jwtProperties;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(JwtProperties jwtProperties, RefreshTokenRepository refreshTokenRepository) {
        this.jwtProperties = jwtProperties;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration()));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshTokenRepository.upsertRefreshToken(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(
                    token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(User user) {
        return refreshTokenRepository.deleteByUser(user);
    }
}
