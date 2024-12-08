UPDATE problems SET example_testcases = '2
3
', example_expected_result = '[5]' WHERE problem_id = 'add-two-numbers';

UPDATE problems SET example_testcases = '[-2, -3, 1, -3, 9]
1
[-3, -5, 4, 1]
2
', example_expected_result = '[9, 1]' WHERE problem_id = 'find-k-largest';

UPDATE problems SET example_testcases = '10
3
', example_expected_result = '[3]' WHERE problem_id = 'count-divisors';

UPDATE problems SET example_testcases = '2
5', example_expected_result = '[1, 5]' WHERE problem_id = 'nth-fibonacci-number';
