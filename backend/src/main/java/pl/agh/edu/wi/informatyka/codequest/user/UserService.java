package pl.agh.edu.wi.informatyka.codequest.user;

import java.util.Optional;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> loadUserById(String userId) {
        return userRepository.findById(userId);
    }
}
