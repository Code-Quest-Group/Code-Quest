package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class CodePreprocessorFactory {
    private static final Map<String, SourceCodePreprocessor> preprocessorMap = new HashMap<>();

    public SourceCodePreprocessor getCodePreprocessor(Language language) throws IOException {
        return switch (language) {
            case PYTHON -> new PythonSourceCodePreprocessor();
                //            case JAVASCRIPT -> null;
                //            case JAVA -> null;
                //            case CPP -> null;
            default -> throw new IllegalArgumentException("Language not supported");
        };
    }
}
