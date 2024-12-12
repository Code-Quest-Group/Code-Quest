package pl.agh.edu.wi.informatyka.codequest.ratelimit;

import jakarta.servlet.http.HttpFilter;
import java.time.Duration;
import java.time.Instant;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.SubmissionLogsRepository;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;

@Service
public class RateLimitService extends HttpFilter {

    private final SubmissionLogsRepository submissionLogsRepository;

    private static final long RATE_LIMIT_SECONDS = 5;

    public RateLimitService(SubmissionLogsRepository submissionLogsRepository) {
        this.submissionLogsRepository = submissionLogsRepository;
    }

    public boolean allowPostingSubmission(String userId) {
        SubmissionLog log = submissionLogsRepository.findLatestSubmissionByUserId(userId);

        if (log != null) {
            Instant now = Instant.now();
            long secondsSinceLastRequest =
                    Duration.between(log.getCreatedAt(), now).getSeconds();
            return secondsSinceLastRequest > RATE_LIMIT_SECONDS;
        }
        return true;
    }
}
