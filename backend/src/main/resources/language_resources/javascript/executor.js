const fs = require('fs');

class Parser {
    static validTypes = ['int', 'str', 'float'];

    constructor(argTypes, shouldValidate = false) {
        this.args = argTypes;
        this.shouldValidate = shouldValidate;

        if (shouldValidate) {
            for (const arg of argTypes) {
                this.validateArgTypeName(arg);
            }
        }
    }

    validateArgTypeName(arg) {
        if (arg.startsWith('list[') && arg.endsWith(']')) {
            return this.validateArgTypeName(arg.slice(5, -1));
        }
        if (!Parser.validTypes.includes(arg)) {
            throw new Error(`Argument ${arg} is not a valid type. Valid types are ${Parser.validTypes.join(',')} + list<T>`);
        }
    }

    parseTestcasesArgs(lines) {
        const numArgs = this.args.length;
        if (lines.length % numArgs !== 0) {
            throw new Error("Test case has wrong number of arguments");
        }

        const parsedArgs = lines.map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                throw new Error("Failed to parse testcase argument: " + line);
            }
        });

        const parsedArgsSets = [];
        for (let i = 0; i < lines.length; i += numArgs) {
            parsedArgsSets.push(parsedArgs.slice(i, i + numArgs));
        }

        if (this.shouldValidate) {
            for (const argsSet of parsedArgsSets) {
                argsSet.forEach((arg, index) => {
                    this.validateArgType(arg, this.args[index]);
                });
            }
        }

        return parsedArgsSets;
    }

    validateArgType(arg, argType) {
        if (typeof arg === 'string' && argType === 'str') {
            return;
        } else if (Array.isArray(arg) && argType.startsWith('list[') && argType.endsWith(']')) {
            const innerType = argType.slice(5, -1);
            for (const innerArg of arg) {
                this.validateArgType(innerArg, innerType);
            }
            return;
        } else if (typeof arg === 'number') {
            if (argType === 'float' || (argType === 'int' && Number.isInteger(arg))) {
                return;
            }
        }

        throw new TypeError(`Invalid argument '${arg}' type. Expected type: ${argType}`);
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("Missing required positional argument: problem_input_types");
        process.exit(1);
    }

    const problemInputTypes = args[0].split(' ');
    const fileIndex = args.indexOf('-f');
    const customSubmission = args.includes('--custom-submission');

    const parser = new Parser(problemInputTypes, customSubmission);

    let inputText;
    if (fileIndex !== -1 && args[fileIndex + 1]) {
        inputText = fs.readFileSync(args[fileIndex + 1], 'utf-8');
    } else {
        inputText = fs.readFileSync(process.stdin.fd, 'utf-8');
    }

    const lines = inputText.trim().split('\n');

    try {
        const parsedArgsSets = parser.parseTestcasesArgs(lines);

        console.log(customSubmission ? "===CUSTOM_SUBMISSION===" : "===SUBMISSION===");
        const results = [];

        for (const parsedArgsSet of parsedArgsSets) {
            const problem = new Problem();
            try {
                const result = problem.solve(...parsedArgsSet);
                console.log("===TESTCASE_STDOUT_SEPARATOR===");
                results.push(result);
            } catch (e) {
                console.error("===ERROR===");
                console.error(e.message);
                process.exit(1);
            }
        }

        console.log("===USER_STDOUT_SEPARATOR===");
        results.forEach(result => console.log(JSON.stringify(result)));
        console.log("===USER_RESULTS_SEPARATOR===");

        if (customSubmission) {
            const systemResults = [];
            for (const parsedArgsSet of parsedArgsSets) {
                const problem = new InternalProblem();
                const result = problem.solve(...parsedArgsSet);
                systemResults.push(result);
            }

            console.log("===SYSTEM_STDOUT_SEPARATOR===");
            systemResults.forEach(result => console.log(JSON.stringify(result)));
            console.log("===SYSTEM_RESULT_SEPARATOR===");
        }
    } catch (e) {
        console.error("===ERROR===");
        console.error(e.message);
    }
}

main();
