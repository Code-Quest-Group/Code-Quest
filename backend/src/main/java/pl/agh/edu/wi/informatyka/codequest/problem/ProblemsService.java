package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.*;
import org.springframework.stereotype.Service;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.CreateProblemDTO;
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

    public Problem createProblem(CreateProblemDTO createProblemDTO) {
        Problem problem = new Problem();
        problem.setProblemId(createProblemDTO.getProblemId());
        problem.setName(createProblemDTO.getName());
        problem.setDescription(createProblemDTO.getDescription());
        problem.setSupportedLanguages(createProblemDTO.getSupportedLanguages());
        problem.setInputFormat(createProblemDTO.getInputFormat());
        problem.setTestCases(createProblemDTO.getTestCases());
        problem.setExpectedResult(createProblemDTO.getExpectedResult());
        problem.setCodeTemplate("");

        problem = this.problemsRepository.save(problem);
        return problem;
    }
}
