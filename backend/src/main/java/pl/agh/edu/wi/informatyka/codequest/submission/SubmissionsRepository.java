package pl.agh.edu.wi.informatyka.codequest.submission;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;

public interface SubmissionsRepository extends CrudRepository<Submission, Long> {
    @Override
    List<Submission> findAll();

    Optional<Submission> findByToken(String token);
}
