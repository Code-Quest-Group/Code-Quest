package pl.agh.edu.wi.informatyka.codequest.auth.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration = 15L * 60 * 1000; // 15 minutes
    private long refreshTokenExpiration = 7L * 24 * 60 * 60 * 1000; // 7 days
}
