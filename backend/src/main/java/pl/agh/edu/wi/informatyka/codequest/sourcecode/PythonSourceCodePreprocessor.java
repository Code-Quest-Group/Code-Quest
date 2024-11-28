package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;

public class PythonSourceCodePreprocessor implements SourceCodePreprocessor {
    private final String parserCode;

    private static final String IMPORTS = """
from typing import *

""";

    public PythonSourceCodePreprocessor(String resourcesPath) throws IOException {
        parserCode = Files.readString(Path.of(resourcesPath, "python", "parser.py"));
    }

    @Override
    public String assembleSourceCode(String code) {
        return IMPORTS + code + "\n\n" + parserCode;
    }

    @Override
    public String assembleSourceCode(String sourceCode, CodeTemplate codeTemplate) {
        return IMPORTS + codeTemplate.getCode() + "\n\n" + sourceCode + "\n\n" + parserCode;
    }
}
