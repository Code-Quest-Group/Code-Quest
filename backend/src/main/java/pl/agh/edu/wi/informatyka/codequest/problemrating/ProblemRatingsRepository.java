package pl.agh.edu.wi.informatyka.codequest.problemrating;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRating;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRatingId;

public interface ProblemRatingsRepository extends CrudRepository<ProblemRating, ProblemRatingId> {

    @Modifying
    @Transactional
    @Query(
            value =
                    """
                    INSERT INTO problem_ratings (user_id, problem_id, rating) \
                    VALUES (:userId, :problemId, :rating) \
                    ON DUPLICATE KEY UPDATE rating = :rating""",
            nativeQuery = true)
    void saveOrUpdateRating(String userId, String problemId, double rating);

    @Query(value = "SELECT AVG(r.rating) FROM ProblemRating r WHERE r.id.problemId = :problemId")
    Double getAverageRatingForProblem(String problemId);
}
