package pl.agh.edu.wi.informatyka.codequest.user;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.problemrating.ProblemRatingsRepository;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRating;
import pl.agh.edu.wi.informatyka.codequest.submission.SubmissionsRepository;
import pl.agh.edu.wi.informatyka.codequest.user.dto.UpdateUserPreferencesDTO;
import pl.agh.edu.wi.informatyka.codequest.user.dto.UserStatisticsDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.Role;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.user.model.UserPreferences;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.UserProblemAttemptsRepository;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemAttempt;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemStatus;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserProblemAttemptsRepository userProblemAttemptsRepository;
    private final SubmissionsRepository submissionsRepository;
    private final ProblemsRepository problemsRepository;
    private final ProblemRatingsRepository problemRatingsRepository;

    public UserService(
            UserRepository userRepository,
            UserProblemAttemptsRepository userProblemAttemptsRepository,
            SubmissionsRepository submissionsRepository,
            ProblemsRepository problemsRepository,
            ProblemRatingsRepository problemRatingsRepository) {
        this.userRepository = userRepository;
        this.userProblemAttemptsRepository = userProblemAttemptsRepository;
        this.submissionsRepository = submissionsRepository;
        this.problemsRepository = problemsRepository;
        this.problemRatingsRepository = problemRatingsRepository;
    }

    public Optional<User> loadUserById(String userId) {
        return userRepository.findById(userId);
    }

    public UserStatisticsDTO getUserStatistics(String userId) {

        Instant oneYearAgo = Instant.now().minus(365, ChronoUnit.DAYS);

        Map<String, Long> submissionsFrequency =
                submissionsRepository.findAllByUserIdAndCreatedAtAfter(userId, oneYearAgo).stream()
                        .collect(Collectors.groupingBy(
                                submission -> submission
                                        .getCreatedAt()
                                        .atZone(ZoneOffset.UTC)
                                        .toLocalDate()
                                        .toString(),
                                Collectors.counting()));
        List<UserProblemAttempt> userProblemAttempts = userProblemAttemptsRepository.findByUserId(userId);

        Set<String> problemIds = userProblemAttempts.stream()
                .filter(attempt -> attempt.getStatus() == UserProblemStatus.SUCCEEDED)
                .map(UserProblemAttempt::getProblemId)
                .collect(Collectors.toSet());

        List<Problem> problemList = problemsRepository.findByProblemIdIn(problemIds);
        Map<String, Long> tagsCount = problemList.stream()
                .map(Problem::getTags)
                .flatMap(Collection::stream)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        Map<String, Double> userRatings = problemRatingsRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(rating -> rating.getId().getProblemId(), ProblemRating::getRating));

        UserStatisticsDTO userStatisticsDTO = new UserStatisticsDTO();
        userStatisticsDTO.setSubmissionsFrequency(submissionsFrequency);
        userStatisticsDTO.setUserProblemAttempts(userProblemAttempts);
        userStatisticsDTO.setUserProblemTagsCount(tagsCount);
        userStatisticsDTO.setUserRatings(userRatings);

        return userStatisticsDTO;
    }

    private Optional<User> getUser(String userId) {
        return this.userRepository.findById(userId);
    }

    public User getUserOrThrow(User authenticatedUser, String userId) {
        boolean hasFullAccess = authenticatedUser.getUserRole() == Role.ADMIN
                || authenticatedUser.getUserId().equals(userId);
        User user = this.getUser(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id '" + userId + "' not found"));
        if (user.getPreferences() == null) {
            UserPreferences preferences = new UserPreferences();
            preferences.setUser(user);
            user.setPreferences(preferences);
            user = userRepository.save(user);
        }

        if (!hasFullAccess) {
            UserPreferences userPreferences = UserPreferences.createNullPreferences();
            userPreferences.setIsProfilePublic(user.getPreferences().getIsProfilePublic());
            user.setPreferences(userPreferences);
        }
        return user;
    }

    public void updateUserPreferences(UpdateUserPreferencesDTO updateDTO) {
        UserPreferences userPreferences = updateDTO.getUser().getPreferences();
        if (updateDTO.getDarkMode() != null) {
            userPreferences.setDarkMode(updateDTO.getDarkMode());
        }
        if (updateDTO.getIsProfilePublic() != null) {
            userPreferences.setIsProfilePublic(updateDTO.getIsProfilePublic());
        }
        if (updateDTO.getLanguage() != null) {
            userPreferences.setLanguage(updateDTO.getLanguage());
        }
        if (updateDTO.getTimezone() != null) {
            userPreferences.setTimezone(updateDTO.getTimezone());
        }
        this.userRepository.save(updateDTO.getUser());
    }
}
