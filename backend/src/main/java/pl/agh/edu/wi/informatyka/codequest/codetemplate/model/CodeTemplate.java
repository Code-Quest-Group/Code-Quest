package pl.agh.edu.wi.informatyka.codequest.codetemplate.model;

import jakarta.persistence.*;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Entity
@Table(
        name = "code_templates",
        uniqueConstraints = @UniqueConstraint(columnNames = {"problem_id", "language", "template_type"}))
@Data
public class CodeTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    String problemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Language language;

    @Enumerated(EnumType.STRING)
    @Column(name = "template_type", nullable = false)
    TemplateType templateType;

    @Column(name = "code", nullable = false, columnDefinition = "text")
    String code;
}
