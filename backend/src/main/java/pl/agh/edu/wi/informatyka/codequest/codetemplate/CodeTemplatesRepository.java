package pl.agh.edu.wi.informatyka.codequest.codetemplate;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;

public interface CodeTemplatesRepository
        extends CrudRepository<CodeTemplate, Long>, JpaSpecificationExecutor<CodeTemplate> {}
