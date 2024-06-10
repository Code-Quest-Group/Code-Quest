import sys

for line in sys.stdin.read().strip().split():
    try:
        a, b = line.split(',')
        a = int(a)
        b = int(b)
        problem = Problem()
        result = problem.solve(a, b)

        print(result)
    except Exception as e:
        print("something went wrong")
