package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class TokenRefreshException extends RuntimeException {

    public TokenRefreshException(String token, String message) {
        super(String.format("Token refresh failed for %s: %s", token, message));
    }
}
