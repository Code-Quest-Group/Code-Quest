package pl.agh.edu.wi.informatyka.codequest.problemrating;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsRepository;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRating;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRatingId;

@Service
public class ProblemRatingsService {
    Logger logger = LoggerFactory.getLogger(ProblemRatingsService.class);

    private final ProblemRatingsRepository problemRatingsRepository;
    private final ProblemsRepository problemsRepository;

    public ProblemRatingsService(
            ProblemRatingsRepository problemRatingsRepository, ProblemsRepository problemsRepository) {
        this.problemRatingsRepository = problemRatingsRepository;
        this.problemsRepository = problemsRepository;
    }

    public void saveOrUpdateRating(String userId, String problemId, double rating) {
        try {
            this.problemRatingsRepository.saveOrUpdateRating(userId, problemId, rating);
            logger.info("User {} added problem {} rating added {}/5.0", userId, problemId, rating);

            Double averageRating = this.problemRatingsRepository.getAverageRatingForProblem(problemId);
            this.problemsRepository.updateRating(problemId, averageRating);

        } catch (DataAccessException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    public List<ProblemRating> getAllUserRatings(String userId) {
        return this.problemRatingsRepository.findByUserId(userId);
    }

    public Optional<ProblemRating> getUserProblemRanking(String problemId, String userId) {
        return this.problemRatingsRepository.findById(new ProblemRatingId(userId, problemId));
    }
}
