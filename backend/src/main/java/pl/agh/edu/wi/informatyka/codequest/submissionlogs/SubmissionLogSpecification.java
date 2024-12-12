package pl.agh.edu.wi.informatyka.codequest.submissionlogs;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.dto.SubmissionLogQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.submissionlogs.model.SubmissionLog;

public final class SubmissionLogSpecification {
    private SubmissionLogSpecification() {}

    public static Specification<SubmissionLog> buildSpecification(SubmissionLogQueryDTO dto) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.getSubmissionId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("submissionId"), dto.getSubmissionId()));
            }

            if (dto.getUserId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), dto.getUserId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
