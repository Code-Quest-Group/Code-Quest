package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import pl.agh.edu.wi.informatyka.codequest.codetemplate.model.CodeTemplate;

public class JavascriptSourceCodePreprocessor implements SourceCodePreprocessor {

    private final String executorCode;

    //    private final String problemVerifierCode;

    private static final String IMPORTS = """
""";

    public JavascriptSourceCodePreprocessor() throws IOException {
        executorCode = new String(
                getClass()
                        .getClassLoader()
                        .getResourceAsStream("language_resources/javascript/executor.js")
                        .readAllBytes(),
                StandardCharsets.UTF_8);
        //        problemVerifierCode = new String(
        //                getClass()
        //                        .getClassLoader()
        //                        .getResourceAsStream("language_resources/python/problem_verifier.py")
        //                        .readAllBytes(),
        //                StandardCharsets.UTF_8);
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
    public String assembleProblemVerifierSourceCode(CodeTemplate codeTemplate) {
        throw new RuntimeException("Verifier not available for javascript!");
        //        return IMPORTS + codeTemplate.getCode() + "\n\n" + "\n\n" + problemVerifierCode;
    }
}
