package pl.agh.edu.wi.informatyka.codequest.submission;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;

public interface SubmissionsRepository
        extends CrudRepository<Submission, String>, JpaSpecificationExecutor<Submission> {
    @Override
    List<Submission> findAll();

    Optional<Submission> findByToken(String token);

    @Query("SELECT s FROM Submission s WHERE s.problemId = :problemId AND s.isPublic = true")
    List<Submission> getPublicByProblemId(String problemId);

    List<Submission> findAllByUserIdAndCreatedAtAfter(String userId, Instant createdAt);
}
