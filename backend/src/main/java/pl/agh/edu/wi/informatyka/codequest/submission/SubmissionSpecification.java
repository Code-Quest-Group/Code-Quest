package pl.agh.edu.wi.informatyka.codequest.submission;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem_;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.submission.model.SubmissionQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission_;
import pl.agh.edu.wi.informatyka.codequest.user.model.User_;

public final class SubmissionSpecification {
    private SubmissionSpecification() {}

    public static Specification<Submission> buildSpecification(SubmissionQueryDTO dto) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.getSubmissionId() != null) {
                predicates.add(criteriaBuilder.equal(root.get(Submission_.submissionId), dto.getSubmissionId()));
            }

            if (dto.getProblemId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get(Submission_.problem).get(Problem_.problemId), dto.getProblemId()));
            }

            if (dto.getLanguage() != null) {
                predicates.add(criteriaBuilder.equal(root.get(Submission_.language), dto.getLanguage()));
            }
            //
            if (dto.getUserId() != null) {
                predicates.add(criteriaBuilder.equal(root.get(Submission_.user).get(User_.userId), dto.getUserId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
