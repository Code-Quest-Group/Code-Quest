package pl.agh.edu.wi.informatyka.codequest.problem;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController()
@RequestMapping("/problems")
@Tag(name = "Problems")
public class ProblemsController {
    private final ProblemsService problemsService;

    public ProblemsController(ProblemsService problemsService) {
        this.problemsService = problemsService;
    }

    @GetMapping("/{problemId}")
    public Problem getProblems(@PathVariable @Parameter(example = "add-two-numbers") String problemId) {
        return problemsService
                .getProblem(problemId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem " + problemId + " not found"));
    }

    @GetMapping()
    public List<Problem> getAllProblems() {
        return problemsService.getAllProblems();
    }
}
