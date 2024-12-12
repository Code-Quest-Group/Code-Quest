package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;

public class PythonSourceCodePreprocessor implements SourceCodePreprocessor {

    private final String executorCode;

    private final String problemVerifierCode;

    private static final String IMPORTS = """
from typing import *

""";

    public PythonSourceCodePreprocessor(String resourcesPath) throws IOException {
        executorCode = new String(
                ClassLoader.getSystemResourceAsStream(resourcesPath + "python/executor.py")
                        .readAllBytes(),
                StandardCharsets.UTF_8);
        problemVerifierCode = new String(
                ClassLoader.getSystemResourceAsStream(resourcesPath + "python/problem_verifier.py")
                        .readAllBytes(),
                StandardCharsets.UTF_8);
    }

    @Override
    public String assembleCustomSubmissionSourceCode(String code) {
        return IMPORTS + code + "\n\n" + executorCode;
    }

    @Override
    public String assembleCustomSubmissionSourceCode(String sourceCode, CodeTemplate codeTemplate) {
        return IMPORTS + codeTemplate.getCode() + "\n\n" + sourceCode + "\n\n" + executorCode;
    }

    @Override
    public String assembleProblemVerifierSourceCode(String sourceCode, CodeTemplate codeTemplate) {
        return IMPORTS + codeTemplate.getCode() + "\n\n" + sourceCode + "\n\n" + problemVerifierCode;
    }
}
