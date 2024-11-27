package pl.agh.edu.wi.informatyka.codequest.userproblemattempt;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.submission.event.SubmissionJudgedEvent;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemAttempt;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemStatus;

@Service
public class UserProblemAttemptsService {
    Logger logger = LoggerFactory.getLogger(UserProblemAttemptsService.class);

    private final UserProblemAttemptsRepository userProblemAttemptsRepository;

    public UserProblemAttemptsService(UserProblemAttemptsRepository userProblemAttemptsRepository) {
        this.userProblemAttemptsRepository = userProblemAttemptsRepository;
    }

    @EventListener
    public void handleSubmissionJudgedEvent(SubmissionJudgedEvent event) {
        UserProblemAttempt currentAttempt = UserProblemAttempt.fromSubmission(event.getSubmission());
        logger.info("Updating user {} problem '{}' status", currentAttempt.getUserId(), currentAttempt.getProblemId());

        // If previously user successfully submitted the solution don't overwrite it with ATTEMPTED
        userProblemAttemptsRepository
                .findByUserIdAndProblemId(currentAttempt.getUserId(), currentAttempt.getProblemId())
                .ifPresent(at -> {
                    if (currentAttempt.getStatus() == UserProblemStatus.ATTEMPTED) {
                        currentAttempt.setStatus(at.getStatus());
                    }
                });
        this.userProblemAttemptsRepository.incrementSubmissionCountAndUpdateTime(currentAttempt);
    }

    public List<UserProblemAttempt> getAllUserAttempts(String userId) {
        return this.userProblemAttemptsRepository.findByUserId(userId);
    }

    public Optional<UserProblemAttempt> getUserAttempt(String problemId, String userId) {
        return this.userProblemAttemptsRepository.findByUserIdAndProblemId(userId, problemId);
    }
}
