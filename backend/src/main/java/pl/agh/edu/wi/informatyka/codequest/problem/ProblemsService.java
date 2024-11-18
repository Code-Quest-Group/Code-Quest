package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.*;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;

@Service
public class ProblemsService {

    private final ProblemsRepository problemsRepository;

    public ProblemsService(ProblemsRepository problemsRepository) {
        this.problemsRepository = problemsRepository;
    }

    public Optional<Problem> getProblem(String problemId) {
        return this.problemsRepository.findById(problemId);
    }

    public List<Problem> getAllProblems() {
        return this.problemsRepository.findAll();
    }

    public void deleteProblem(String problemId) {
        this.problemsRepository.deleteById(problemId);
    }
}
