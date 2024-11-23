package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.CodeTemplatesRepository;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.CreateProblemDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;

@Service
public class ProblemsService {

    private final ProblemsRepository problemsRepository;

    public ProblemsService(ProblemsRepository problemsRepository, CodeTemplatesRepository codeTemplatesRepository) {
        this.problemsRepository = problemsRepository;
    }

    public Optional<Problem> getProblem(String problemId) {
        return this.problemsRepository.findById(problemId);
    }

    public Problem getProblemOrThrow(String problemId) {
        return this.getProblem(problemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Problem with id '" + problemId + "' not found"));
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
