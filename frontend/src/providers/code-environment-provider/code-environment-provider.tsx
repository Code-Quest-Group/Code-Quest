/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createContext, ReactNode, useContext, useState } from 'react'
import { Problem } from '../../types'

type CodeEnvironmentProviderProps = {
    children: ReactNode
    problem: Problem
}

type CodeEnvironmentContextType = {
    problem: Problem
    code: string
    currentLanguage: string
    testCases: string
    currentTestIndex: number
    submissionId: string
    resetValue: boolean
    receivedOutput: (string | number)[]
    inputFormat: string
    expectedResults: (string | number)[]
    setCurrentProblem: (problem: Problem) => void
    setCurrentLanguage: (language: string) => void
    setCode: (code: string) => void
    setTestCases: (testCases: string) => void
    setCurrentTestIndex: (index: number) => void
    setSubmissionId: (id: string) => void
    setReceivedOutput: (output: (string | number)[]) => void
    resetEnvironment: (resetValue: boolean) => void
    setExpectedResults: (results: (string | number)[]) => void
}

const CodeEnvironmentContext = createContext<CodeEnvironmentContextType>({
  problem: {} as Problem,
  code: '',
  currentLanguage: '',
  testCases: '',
  currentTestIndex: 1,
  submissionId: '',
  resetValue: false,
  receivedOutput: [],
  inputFormat: '',
  expectedResults: [],
  setCurrentProblem: () => {},
  setCurrentLanguage: () => {},
  setCode: () => {},
  setTestCases: () => {},
  setCurrentTestIndex: () => {},
  setSubmissionId: () => {},
  setReceivedOutput: () => {},
  resetEnvironment: () => {},
  setExpectedResults: () => {},
})

export const useCodeEnvironment = () => {
  return useContext(CodeEnvironmentContext)
}

export const CodeEnvironmentProvider = ({ children, problem }: CodeEnvironmentProviderProps) => {
  const [currentProblem, setCurrentProblem] = useState<Problem>(problem)
  const [currentLanguage, setCurrentLanguage] = useState('PYTHON')
  const [code, setCode] = useState(problem.codeTemplate ? `\n${problem.codeTemplate}` : '')
  const [testCases, setTestCases] = useState(problem.exampleTestCases)
  const [currentTestIndex, setCurrentTestIndex] = useState(1)
  const [submissionId, setSubmissionId] = useState('')
  const [receivedOutput, setReceivedOutput] = useState<(string | number)[]>([])
  const [expectedResults, setExpectedResults] = useState<(string | number)[]>([])
  const [resetValue, resetEnvironment] = useState(false)
  const [inputFormat, _] = useState(problem.inputFormat)

  return (
    <CodeEnvironmentContext.Provider
      value={{
        problem: currentProblem,
        currentLanguage,
        code,
        testCases,
        currentTestIndex,
        submissionId,
        receivedOutput,
        resetValue,
        inputFormat,
        expectedResults,
        setCurrentProblem,
        setCurrentLanguage,
        setCode,
        setTestCases,
        setCurrentTestIndex,
        setSubmissionId,
        setReceivedOutput,
        resetEnvironment,
        setExpectedResults,
      }}
    >
      {children}
    </CodeEnvironmentContext.Provider>
  )
}
