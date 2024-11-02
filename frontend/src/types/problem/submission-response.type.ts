export type SubmissionResponse = {
  correct_testcases: number; // The number of correct test cases
  created_at: string; // ISO 8601 date string representing when the submission was created
  error_message: string; // Message detailing any errors that occurred
  finished_at: string; // ISO 8601 date string representing when the submission finished processing
  language: string; // The programming language used for the submission
  memory: number; // Memory usage in bytes
  problem_id: string; // ID of the problem
  status: string; // Submission status (e.g., "WRONG_ANSWER")
  stdout?: string; // Standard output from the submission
  stderr?: string // Error output from the submission
  submission_id: number; // Unique ID for the submission
  time: number; // Time taken for the submission in seconds
  token: string; // A token associated with the submission
  total_testcases: number; // Total number of test cases
};
