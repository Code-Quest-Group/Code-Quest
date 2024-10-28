DELETE FROM problems;

INSERT INTO problems (problem_id, name, description, supported_languages, input_format, code_template, test_cases,
                      expected_result)
values ('add-two-numbers', 'Add two numbers', 'Calculate the sum of two numbers', '["PYTHON"]', 'int int',
        'class Problem:\n    def solve(self, a: int, b: int):\n        pass\n', '1\n6\n2\n2\n3\n7\n4\n2\n5\n3\n',
        '7\n4\n10\n6\n8\n'),
       ('nth-fibonacci-number', 'Nth Fibonacci number', 'Find nth fibonacci number.', '["PYTHON"]',
        'int', 'class Problem:\n\n    def solve(self, n: int):\n        pass\n\n', '0\n1\n2\n3\n4\n5\n10\n18\n',
        '0\n1\n1\n2\n3\n5\n55\n2584'),
       ('count-divisors', 'Count divisors', 'Count how many numbers less then n are divisible by k', '["PYTHON"]',
        'int int', 'class Problem:\n\n    def solve(self, n: int, k: int):\n        pass\n\n\n', '10\n2\n100\n25\n',
        '4\n3\n')