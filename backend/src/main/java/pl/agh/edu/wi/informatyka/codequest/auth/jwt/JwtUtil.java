package pl.agh.edu.wi.informatyka.codequest.auth.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import java.util.Date;
import org.springframework.stereotype.Component;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Component
public class JwtUtil {
    private final JwtProperties jwtProperties;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public String generateToken(User user) {
        return JWT.create()
                .withSubject(user.getUserId())
                .withClaim("USER_ROLE", user.getUserRole().name())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtProperties.getAccessTokenExpiration()))
                .sign(Algorithm.HMAC256(jwtProperties.getSecret()));
    }

    public String extractUsername(String token) {

        DecodedJWT decodedJWT = verifyToken(token);
        return decodedJWT.getSubject();
    }

    public DecodedJWT throwIfInvalidToken(String token) {
        return verifyToken(token);
    }

    private DecodedJWT verifyToken(String token) {
        JWTVerifier verifier =
                JWT.require(Algorithm.HMAC256(jwtProperties.getSecret())).build();
        return verifier.verify(token);
    }
}
