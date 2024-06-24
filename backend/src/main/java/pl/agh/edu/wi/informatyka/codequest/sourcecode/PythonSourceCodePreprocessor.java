package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class PythonSourceCodePreprocessor implements SourceCodePreprocessor {
    private final String parserCode;

    public PythonSourceCodePreprocessor(String resourcesPath) throws IOException {
        parserCode = Files.readString(Path.of(resourcesPath, "python", "parser.py"));
    }

    @Override
    public String assembleSourceCode(String code) {
        return code + "\n\n" + parserCode;
    }
}
