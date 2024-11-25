package pl.agh.edu.wi.informatyka.codequest.problem;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;

public interface ProblemsRepository extends CrudRepository<Problem, String> {
    @Override
    List<Problem> findAll();

    @Modifying
    @Transactional
    @Query("UPDATE Problem p SET p.rating = :averageRating WHERE p.problemId = :problemId")
    void updateRating(String problemId, Double averageRating);
}
