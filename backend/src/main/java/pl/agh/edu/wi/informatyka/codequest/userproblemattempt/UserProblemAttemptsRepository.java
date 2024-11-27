package pl.agh.edu.wi.informatyka.codequest.userproblemattempt;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemAttempt;

public interface UserProblemAttemptsRepository extends JpaRepository<UserProblemAttempt, Long> {
    Optional<UserProblemAttempt> findByUserIdAndProblemId(String userId, String problemId);

    List<UserProblemAttempt> findByUserId(String userId);

    @Modifying
    @Transactional
    @Query(
            value =
                    "INSERT INTO user_problem_attempts (user_id, problem_id, submission_count, status, last_submission_time) "
                            + "VALUES (:#{#attempt.userId}, :#{#attempt.problemId}, 1, :#{#attempt.status.name()}, :#{#attempt.lastSubmissionTime}) "
                            + "ON DUPLICATE KEY UPDATE submission_count = submission_count + 1, last_submission_time = :#{#attempt.lastSubmissionTime},"
                            + "status = :#{#attempt.status.name()}",
            nativeQuery = true)
    int incrementSubmissionCountAndUpdateTime(UserProblemAttempt attempt);
}
