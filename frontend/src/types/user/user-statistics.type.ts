export type UserStatistics = {
    submissions_frequency: {
      [date: string]: number
    }
    user_problem_attempts: Array<{
      user_id: string
      problem_id: string
      problem_name: string
      user_problem_status: string
      submission_count: number
      last_submission_time: string
    }>
    user_problem_tags_count: {
      [tag: string]: number
    }
}
