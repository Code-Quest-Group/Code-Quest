import { Tags } from './tags.type'

type CodeTemplate = {
  id: number;
  problemId: string;
  language: 'JAVASCRIPT' | 'PYTHON';
  templateType: 'DEFAULT_DEFINITION';
  code: string;
}

export type Problem = {
  problemId: string
  name: string
  description: string
  supportedLanguages: string[]
  inputFormat: string
  codeTemplate: string
  codeTemplates?: CodeTemplate[]
  tags: Tags[]
  constraints: string
  hints: string[]
  exampleTestCases: string
  exampleExpectedResults: string[]
  rating?: number
}
