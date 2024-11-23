package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.TemplateType;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

public interface CodeTemplatesRepository
        extends CrudRepository<CodeTemplate, Long>, JpaSpecificationExecutor<CodeTemplate> {

    Optional<CodeTemplate> findByProblemIdAndLanguageAndTemplateType(
            String problemId, Language language, TemplateType type);
}
