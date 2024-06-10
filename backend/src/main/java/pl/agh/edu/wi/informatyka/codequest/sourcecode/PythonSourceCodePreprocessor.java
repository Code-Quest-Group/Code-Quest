package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import java.io.IOException;

public class PythonSourceCodePreprocessor implements SourceCodePreprocessor {
    private final String preprocessingCode;

    public PythonSourceCodePreprocessor() throws IOException {
        preprocessingCode = new String(Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream("parse.py")
                .readAllBytes());
    }

    @Override
    public String assembleSourceCode(String code) {
        return code + "\n\n" + preprocessingCode;
    }
}
