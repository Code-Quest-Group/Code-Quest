# Code Quest

## Problems List

### 1. Add two numbers

```python

class Problem:
    # Implement a function that would add two numbers together.
    def solve(self, a, b): 
        ...
```

This code template is available in `backend/langauge_resources/python/template.py` alongside the parser `backend/langauge_resources/python/parser.py`

## Swagger

Go to http://localhost:8080/api or http://localhost:8080/swagger-ui/index.html to view swagger API documentation.

## Parser

The parser is responsible for transforming the data from a text form into the argumens for `solve(...) function`.
To support statically typed langauge exact type of argument must be known. That's why parser uses takes the problem_input_types argument.

`usage: parser.py [-h] [--file FILE] [--test-args] [--fail-fast] problem_input_types`

Parser options details are shown with `python parser.py --help`

### Example
Parser expects one argument per line, for example for problem:
```python
class Problem:

    def solve(self, str1, str2, int1):
        ...
```
the parser should be run as `parser.py "str str int"`
and arguments provided to stdin could look like:
```
str1
str2
3
strX
strY
3421
```


### How to run judge0

1. Ensure configuration file `judge/judge0.conf` is present.
2. Change directory `cd judge/docker-compose.yml`'
3. Run `docker-compose up` 

    Alternatively use `Start Judge0` IntelliJ run configuration.
4. Verify the server is running on http://localhost:2358/docs.

### How to start the Server
Run:
`./gradlew bootRun`

### Used IntelliJ Plugins
* SonarLint
* palantir-java-format
* .ignore

---
Mikołaj Maślak, Miłosz Junak