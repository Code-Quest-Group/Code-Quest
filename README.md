# Code Quest

## CodeSubmissionService

```
#include <stdio.h>

int main(void) {
  char name[10];
  scanf("%s", name);
  printf("hello, %s\n", name);
  return 0;
}
```

```shell
curl -X POST "http://localhost:8080/submissions" \
    -H "Content-Type: application/json" \
    -d '{
        "source_code": "#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\\n\", name);\n  return 0;\n}",    "language_id": "50",
        "language_id": "50",
        "stdin": "world"
    }'
```
Example curl request for running C code with 'world' provided to the stdin.


## Developer Instructions
### How to run judge0

1. Ensure configuration file `judge/judge0.conf` is present.
2. Change directory `cd judge/docker-compose.yml`'
3. Run `docker-compose up` 

    Alternatively use `Start Judge0` IntelliJ run configuration.
4. Verify the server is running on http://localhost:2358/docs.

### Used IntelliJ Plugins
* SonarLint
* palantir-java-format
* .ignore

---
Mikołaj Maślak, Miłosz Junak