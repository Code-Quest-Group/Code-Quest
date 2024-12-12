package pl.agh.edu.wi.informatyka.codequest.submissionlogs;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;

public interface SubmissionLogsRepository
        extends CrudRepository<SubmissionLog, String>, JpaSpecificationExecutor<SubmissionLog> {

    SubmissionLog findByToken(String token);

    @Query("SELECT s FROM SubmissionLog s WHERE s.userId = :userId ORDER BY s.createdAt DESC LIMIT 1")
    SubmissionLog findLatestSubmissionByUserId(String userId);
}
