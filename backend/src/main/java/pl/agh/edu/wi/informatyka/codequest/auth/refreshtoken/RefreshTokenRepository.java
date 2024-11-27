package pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken;

import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import pl.agh.edu.wi.informatyka.codequest.auth.refreshtoken.model.RefreshToken;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    int deleteByUser(User user);

    @Modifying
    @Transactional
    @Query(
            value =
                    "INSERT INTO refresh_tokens (user_id, token, expiry_date) "
                            + "VALUES (:#{#refreshToken.user.userId}, :#{#refreshToken.token}, :#{#refreshToken.expiryDate}) "
                            + "ON DUPLICATE KEY UPDATE token = :#{#refreshToken.token}, expiry_date = :#{#refreshToken.expiryDate}",
            nativeQuery = true)
    void upsertRefreshToken(@Param("refreshToken") RefreshToken refreshToken);
}
