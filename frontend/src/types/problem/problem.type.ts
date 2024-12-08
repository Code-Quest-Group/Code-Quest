import { Tags } from './tags.type'

export type Problem = {
  problemId: string
  name: string
  description: string
  supportedLanguages: string[]
  inputFormat: string
  codeTemplate: string
  tags: Tags[]
  constraints: string
  hints: string[]
  exampleTestCases: string
  exampleExpectedResults: string[]
  rating?: number
}
