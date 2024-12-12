# Data transfer format between Java Spring server and Judge0

## Currently Implemented

- [x] Python
- [ ] C++
- [ ] Java
- [ ] Javascript

`./python/parser.py` exists, this script is responsible for parsing and executing the testcases.

## Argument types and it's mapping

| Type     | Python    | C++              | Java     | Javascript |
|----------|-----------|------------------|----------|------------|
| int      | `int`     | `int`            | `int`    | `number`   |
| long     | `int`     | `long long`      | `long`   | `number`   |
| double   | `int`     | `double`         | `double` | `number`   |
| string   | `str`     | `std::string`    | `String` | `string`   |
| array[T] | `List[T]` | `std::vector<T>` | `T[]`    | `Array`    |

Arrays can be nested

## Format

All testcases are serialized and deserialized to json, each input argument is separated by a new line. Each argument line must be a valid json.

### Testing input file format

```text
ARG0
ARG1
ARG2
ARG0
ARG1
ARG2
```
### Testing output file format
For regular submissions:
```text
...
[user stdout]
...
===TESTCASE_STDOUT_SEPARATOR===
<testcase 2 user stdout>
...
===USER_STDOUT_SEPARATOR===
<testcase result 1>
<testcase result 2>
===USER_RESULTS_SEPARATOR===
```

For submissions with custom testcases
```text
<testcase 1 user stdout>
===TESTCASE_STDOUT_SEPARATOR===
<testcase 2 user stdout>
===USER_STDOUT_SEPARATOR===
<testcase result 1>
<testcase result 2>
===USER_RESULTS_SEPARATOR===
...
===SYSTEM_RESULT_SEPARATOR===
<testcase result 2>
<testcase result 2>
```


