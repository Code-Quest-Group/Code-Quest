import argparse
import sys


class ProblemDebug:
    def solve(self, *args):
        print(*args, sep=' | ')


class Parser:
    type_map = {
        'int': int,
        'str': str,
        'float': float,
    }

    def __init__(self, arguments: [str]):
        for arg in arguments:
            if arg not in self.type_map:
                raise ValueError(f'Argument {arg} is not a valid type. Valid types are {self.type_map.keys()}')

        self.args = arguments

    def parse_testcases_args(self, lines: [str]):
        num_args = len(self.args)
        if len(lines) % num_args != 0:
            raise ValueError("Test case has wrong number of arguments")

        parsed_args_sets = []
        for i in range(0, len(lines), num_args):
            parsed_args_set = self._parse_single_testcase_args(lines[i:i + num_args])
            parsed_args_sets.append(parsed_args_set)

        return parsed_args_sets

    def _parse_single_testcase_args(self, lines_subset: [str]):
        parsed_args = []
        for arg, line in zip(self.args, lines_subset):
            parsed_args.append(self.type_map[arg](line.strip()))
        return parsed_args


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Parse test cases arguments from stdin and execute the solve(*args) function. Currently supported "
                    "input types: 'int', 'str'")
    parser.add_argument('problem_input_types', type=str, help='types of the input arguments (e.g., "str str int")')
    parser.add_argument('--file', '-f', type=str, help='load the test cases from a file instead of stdin')
    parser.add_argument('--test-args', '-t', action='store_true',
                        help='print parsed arguments to stdout instead of test results')
    parser.add_argument('--fail-at-end ', '-fae', action='store_true', help='do not fail after a first failure')

    args = parser.parse_args()

    problem_input_types = args.problem_input_types.split(' ')
    parser = Parser(problem_input_types)

    input = sys.stdin.read() if args.file is None else open(args.file, 'r').read()

    lines = input.strip().split('\n')
    parsed_args_sets = parser.parse_testcases_args(lines)

    Tested_class = ProblemDebug if args.test_args else Problem

    if hasattr(args, 'fail_at_end'):
        for parsed_args_set in parsed_args_sets:
            problem = Tested_class()
            try:
                result = problem.solve(*parsed_args_set)
                print(result)
            except Exception as e:
                print("ERROR: ", e)
    else:
        for parsed_args_set in parsed_args_sets:
            problem = Tested_class()
            result = problem.solve(*parsed_args_set)
            print(result)
