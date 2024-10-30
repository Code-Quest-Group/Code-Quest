package pl.agh.edu.wi.informatyka.codequest.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String email);

    Optional<User> findByEmailOrUsername(String username, String email);
}
