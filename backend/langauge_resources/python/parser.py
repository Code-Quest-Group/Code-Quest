import argparse
import sys
import json
from typing import List

class ProblemDebug:
    def solve(self, *args):
        print(*args, sep=' | ')

class Parser:
    valid_types = ['int', 'str', 'float']

    def __init__(self, arguments: List[str], should_validate: bool = False):
        if should_validate:
            for arg in arguments:
                self.validate_arg_type_name(arg)

        self.should_validate = should_validate
        self.args = arguments

    def validate_arg_type_name(self, arg: str):
            if arg.startswith('list[') and arg.endswith(']'):
                return self.validate_arg_type_name(arg[5:-1])
            if arg not in self.valid_types:
                raise ValueError(f'Argument {arg} is not a valid type. Valid types are {",".join(self.valid_types)} + list<T>')


    def parse_testcases_args(self, lines: List[str]):
        num_args = len(self.args)
        if len(lines) % num_args != 0:
            raise ValueError("Test case has wrong number of arguments")


        parsed_args = []
        for line in lines:
            try:
                arg = json.loads(line)
                parsed_args.append(arg)
            except Exception:
                raise ValueError("Failed to parse testcase argument: " + line)
        parsed_args_sets = [parsed_args[i:i + num_args] for i in range(0, len(lines), num_args)]

        if self.should_validate:
            for args_set in parsed_args_sets:
                for arg, arg_type in zip(args_set, self.args):
                    self.validate_arg_type(arg, arg_type)

        return parsed_args_sets


    def validate_arg_type(self, arg: any, arg_type: str):
        if isinstance(arg, str):
            if arg_type == 'string':
                return
        elif isinstance(arg, list):
            if arg_type.startswith('list[') and arg_type.endswith(']'):
                inner_type = arg_type[5:-1]
                for inner_arg in arg:
                    self.validate_arg_type(inner_arg, inner_type)
                return

        elif isinstance(arg, float):
            if arg_type == 'float':
                return
        elif isinstance(arg, int):
            if arg_type == 'float' or arg_type == 'int':
                return

        raise TypeError(f"Invalid argument '{str(arg)}' type expected type " + arg_type)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Parse test cases arguments from stdin and execute the solve(*args) function")
    parser.add_argument('problem_input_types', type=str, help='types of the input arguments (e.g., "str str int")')
    parser.add_argument('--file', '-f', type=str, help='load the test cases from a file instead of stdin')
    parser.add_argument('--run-system-solution', action='store_true', help='run system solution for custom testcases')
    parser.add_argument('--test-args', '-t', action='store_true',
                        help='print parsed arguments to stdout instead of test results')
    parser.add_argument('--fail-at-end', '-fae', action='store_true', help='do not fail after a first failure')
    parser.add_argument('--validate-input-types', '-va', action='store_true', help='validate input types')


    args = parser.parse_args()

    try:

        problem_input_types = args.problem_input_types.split(' ')
        parser = Parser(problem_input_types, args.validate_input_types)

        text_input = sys.stdin.read() if args.file is None else open(args.file, 'r').read()

        lines = text_input.strip().split('\n')
        parsed_args_sets = parser.parse_testcases_args(lines)

        Tested_class = ProblemDebug if args.test_args else Problem
    except Exception as e:
        print("===ERROR===")
        print(str(e))
    else:

        results = []

        for parsed_args_set in parsed_args_sets:
            problem = Tested_class()
            try:
                result = problem.solve(*parsed_args_set)
                print("===TESTCASE_STDOUT_SEPARATOR===")
                results.append(result)
            except Exception as e:
                if args.fail_at_end:
                    results.append("ERROR: ", e)
                else:
                    print("===ERROR===")
                    print(str(e))
                    exit(0)

        print("===USER_STDOUT_SEPARATOR===")
        for result in results:
            print(json.dumps(result))

        print("===USER_RESULTS_SEPARATOR===")

        if args.run_system_solution:
            system_results = []
            for parsed_args_set in parsed_args_sets:
                problem = InternalProblem()
                result = problem.solve(*parsed_args_set)
                system_results.append(result)

            print("===SYSTEM_STDOUT_SEPARATOR===")
            for result in system_results:
                print(json.dumps(result))
            print("===SYSTEM_RESULT_SEPARATOR===")

