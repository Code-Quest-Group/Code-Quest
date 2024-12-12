export type Proposal = {
    name: string
    description: string
    tags: string[]
    constraints: string
    hints: string[]
    rating: number
    problem_id: string
    supported_languages: string[]
    input_format: string
    code_template: string
    example_testcases: string
    example_expected_result: string[]
    user_problem_details: {
      rating: number
      user_problem_status: 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'
      submission_count: number
      last_submission_time: string
    }
    code_templates: {
      id: number
      problemId: string
      language: string
      templateType: 'DEFAULT_DEFINITION' | 'CUSTOM_DEFINITION'
      code: string
    }[]
    problem_status: 'APPROVED' | 'REJECTED' | 'PENDING'
    author: string
}
