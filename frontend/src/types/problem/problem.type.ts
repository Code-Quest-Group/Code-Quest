import { Solution } from './solution.type'
import { Comment } from './comment.type'

export type Problem = {
  problemId: string;
  name: string;
  description: string;
  supportedLanguages: string[];
  inputFormat: string;
  codeTemplate: string;
  testCases: string;
  expectedResult: string;
  tags: string[]; // Brakuje
  example: string; // Brakuje
  constraints: string; // Brakuje
  hints?: string; // Brakuje
  pseudocode?: string; // Brakuje
  userSolutions?: Solution[]; // Brakuje
  rating?: number; // Brakuje
  comments?: Comment[] // Brakuje
}
