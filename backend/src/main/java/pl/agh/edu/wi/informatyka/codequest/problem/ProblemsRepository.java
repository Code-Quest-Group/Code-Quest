package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;

public interface ProblemsRepository extends CrudRepository<Problem, String> {
    @Override
    List<Problem> findAll();
}
