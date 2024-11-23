INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'add-two-numbers', 'PYTHON', 'DEFAULT_DEFINITION', 'class Problem:
    
    def solve(self, a: int, b: int):
        pass
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;
INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'add-two-numbers', 'PYTHON', 'REFERENCE_SOLUTION', 'class InternalProblem:
    
    def solve(self, a: int, b: int):
        return a + b
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;

INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'count-divisors', 'PYTHON', 'DEFAULT_DEFINITION', 'class Problem:

    def solve(self, n; int, k: int):
        pass
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;
INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'count-divisors', 'PYTHON', 'REFERENCE_SOLUTION', 'class InternalProblem:

    def solve(self, n: int, k:int):
        ans = 0
        for i in range(k, n):
            if i % k == 0:
                ans += 1
        return ans
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;

INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'nth-fibonacci-number', 'PYTHON', 'DEFAULT_DEFINITION', 'class Problem:

    def solve(self, n; int):
        pass
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;
INSERT INTO `code-quest`.code_templates (problem_id, language, template_type, code) VALUES ( 'nth-fibonacci-number', 'PYTHON', 'REFERENCE_SOLUTION', 'class InternalProblem:

    def solve(self, n: int):
        if n <= 1:
            return 0

        a, b = 0, 1

        for _ in range(2, n):
            a, b = b, a + b

        return b
') as ct
ON DUPLICATE KEY UPDATE code = ct.code;
