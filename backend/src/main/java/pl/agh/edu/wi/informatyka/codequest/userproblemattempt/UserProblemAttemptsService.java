package pl.agh.edu.wi.informatyka.codequest.userproblemattempt;

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
        logger.info(
                "Updating user {} problem {} status",
                currentAttempt.getUser().getUserId(),
                currentAttempt.getProblem().getProblemId());

        // If previously user successfully submitted the solution don't overwrite it with ATTEMPTED
        userProblemAttemptsRepository
                .findByUserIdAndProblemId(currentAttempt.getProblemId(), currentAttempt.getUserId())
                .ifPresent((at) -> {
                    if (currentAttempt.getStatus() == UserProblemStatus.ATTEMPTED) {
                        currentAttempt.setStatus(at.getStatus());
                    }
                });
        this.userProblemAttemptsRepository.incrementSubmissionCountAndUpdateTime(currentAttempt);
    }
}
