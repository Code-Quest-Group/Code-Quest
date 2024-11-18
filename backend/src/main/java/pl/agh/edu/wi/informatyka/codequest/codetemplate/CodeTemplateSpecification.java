package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.dto.CodeTemplateQueryDTO;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate_;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem_;

public final class CodeTemplateSpecification {
    private CodeTemplateSpecification() {}

    public static Specification<CodeTemplate> buildSpecification(CodeTemplateQueryDTO dto) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dto.getId() != null) {
                predicates.add(criteriaBuilder.equal(root.get(CodeTemplate_.ID), dto.getId()));
            }

            if (dto.getProblemId() != null) {
                predicates.add(criteriaBuilder.equal(root.get(Problem_.PROBLEM_ID), dto.getProblemId()));
            }

            if (dto.getLanguage() != null) {
                predicates.add(criteriaBuilder.equal(root.get(CodeTemplate_.LANGUAGE), dto.getLanguage()));
            }

            if (dto.getTemplateType() != null) {
                predicates.add(criteriaBuilder.equal(root.get(CodeTemplate_.TEMPLATE_TYPE), dto.getTemplateType()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
