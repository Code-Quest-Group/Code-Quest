# Code Quest

## Swagger Ui

Go to http://localhost:8080/api to view API documentation.

## Problems
### Add two numbers
Problem implementation must be send in format:

```python
class Problem:

    def solve(self, a, b):
        ...
```
This code template is available in `/src/main/resources/template.py` alongside the parsing function `/src/main/resources/parse.py`

## Developer Instructions
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