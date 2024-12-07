package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.CodeTemplatesRepository;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.CodeTemplatesService;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.problem.dto.CreateProblemDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.problemrating.ProblemRatingsService;
import pl.agh.edu.wi.informatyka.codequest.problemrating.model.ProblemRating;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.user.model.UserProblemDetails;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.UserProblemAttemptsService;
import pl.agh.edu.wi.informatyka.codequest.userproblemattempt.model.UserProblemAttempt;

@Service
public class ProblemsService {

    private final ProblemsRepository problemsRepository;
    private final ProblemRatingsService problemRatingsService;
    private final UserProblemAttemptsService userProblemAttemptsService;
    private final CodeTemplatesService codeTemplatesService;

    public ProblemsService(
            ProblemsRepository problemsRepository,
            CodeTemplatesRepository codeTemplatesRepository,
            ProblemRatingsService problemRatingsService,
            UserProblemAttemptsService userProblemAttemptsService,
            CodeTemplatesService codeTemplatesService) {
        this.problemsRepository = problemsRepository;
        this.problemRatingsService = problemRatingsService;
        this.userProblemAttemptsService = userProblemAttemptsService;
        this.codeTemplatesService = codeTemplatesService;
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

    public List<Problem> getAllProblemsWithUserDetails(User user) {
        Map<String, UserProblemAttempt> attemptsMap =
                this.userProblemAttemptsService.getAllUserAttempts(user.getUserId()).stream()
                        .collect(Collectors.toMap(UserProblemAttempt::getProblemId, Function.identity()));
        Map<String, ProblemRating> problemRatingsMap =
                this.problemRatingsService.getAllUserRatings(user.getUserId()).stream()
                        .collect(Collectors.toMap(pr -> pr.getId().getProblemId(), Function.identity()));

        return this.getAllProblems().stream()
                .map(problem -> {
                    UserProblemDetails userProblemDetails = new UserProblemDetails();
                    UserProblemAttempt attempt = attemptsMap.get(problem.getProblemId());
                    if (attempt != null) {
                        userProblemDetails.setLastSubmissionTime(attempt.getLastSubmissionTime());
                        userProblemDetails.setSubmissionCount(attempt.getSubmissionCount());
                        userProblemDetails.setStatus(attempt.getStatus());
                    }

                    ProblemRating problemRating = problemRatingsMap.get(problem.getProblemId());
                    if (problemRating != null) {
                        userProblemDetails.setRating(problemRating.getRating());
                    }

                    problem.setUserProblemDetails(userProblemDetails);

                    return problem;
                })
                .toList();
    }

    public Problem getProblemWithUserDetails(String problemId, User user) {
        Problem problem = this.getProblemOrThrow(problemId);
        UserProblemDetails details = new UserProblemDetails();

        this.userProblemAttemptsService
                .getUserAttempt(problemId, user.getUserId())
                .ifPresent(attempt -> {
                    details.setLastSubmissionTime(attempt.getLastSubmissionTime());
                    details.setSubmissionCount(attempt.getSubmissionCount());
                    details.setStatus(attempt.getStatus());
                });

        this.problemRatingsService
                .getUserProblemRanking(problemId, user.getUserId())
                .ifPresent(problemRating -> details.setRating(problemRating.getRating()));

        List<CodeTemplate> codeTemplates = this.codeTemplatesService.getDefaultCodeTemplates(problemId);

        problem.setUserProblemDetails(details);
        problem.setCodeTemplates(codeTemplates);
        return problem;
    }

    public Problem getProblemWithTemplates(String problemId) {
        Problem problem = this.getProblemOrThrow(problemId);
        List<CodeTemplate> codeTemplates = this.codeTemplatesService.getDefaultCodeTemplates(problemId);
        problem.setCodeTemplates(codeTemplates);

        return problem;
    }
}
