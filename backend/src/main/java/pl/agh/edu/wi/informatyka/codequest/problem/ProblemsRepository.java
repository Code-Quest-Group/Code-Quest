package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ProblemsRepository extends CrudRepository<Problem, String> {
    @Override
    List<Problem> findAll();
}
