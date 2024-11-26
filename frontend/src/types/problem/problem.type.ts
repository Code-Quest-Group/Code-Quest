import { Solution } from './solution.type'
import { Comment } from './comment.type'
import { Tags } from './tags.type'

export type Problem = {
  problemId: string;
  name: string;
  description: string;
  supportedLanguages: string[];
  inputFormat: string;
  codeTemplate: string;
  tags: Tags[];
  example: string; // Brakuje
  constraints: string; // Brakuje
  hints: string[];
  exampleTestCases: string
  exampleExpectedResults: string[]
  userSolutions?: Solution[]; // Brakuje
  rating?: number;
  comments?: Comment[] // Brakuje
}
