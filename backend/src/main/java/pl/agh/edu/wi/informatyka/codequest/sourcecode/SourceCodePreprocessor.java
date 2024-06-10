package pl.agh.edu.wi.informatyka.codequest.sourcecode;

/**
 * This interface is responsible for taking user code submission, validating it and adding logic responsible for parsing
 * the test cases from stdin. <br>
 * Python example:
 *
 * <pre>
 * <b>User submitted code:</b>
 *
 * def solve(x: int):
 *     ...
 *
 * <b>Code added by this class:</b>
 *
 * import sys
 * for input_line in sys.stdin.read().strip().split():
 *     x = int(input_line)
 *     result = solve(x)
 *     print(x)
 *
 * </pre>
 *
 * Collected stdout would be compared with the expected solution
 */
public interface SourceCodePreprocessor {

    String assembleSourceCode(String code);
}
