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
    failingTests: boolean[]
    currentTestIndex: number
    submissionId: number
    resetValue: boolean
    receivedOutput: (string | number)[][]
    setCurrentProblem: (problem: Problem) => void
    setCurrentLanguage: (language: string) => void
    setCode: (code: string) => void
    setTestCases: (testCases: string) => void
    setFailingTests: (failingTests: boolean[]) => void
    setCurrentTestIndex: (index: number) => void
    setSubmissionId: (id: number) => void
    setReceivedOutput: (output: (string | number)[][]) => void
    resetEnvironment: (resetValue: boolean) => void
}

const CodeEnvironmentContext = createContext<CodeEnvironmentContextType>({
  problem: {} as Problem,
  code: '',
  currentLanguage: '',
  testCases: '',
  failingTests: [],
  currentTestIndex: 1,
  submissionId: 0,
  resetValue: false,
  receivedOutput: [],
  setCurrentProblem: () => {},
  setCurrentLanguage: () => {},
  setCode: () => {},
  setTestCases: () => {},
  setFailingTests: () => {},
  setCurrentTestIndex: () => {},
  setSubmissionId: () => {},
  setReceivedOutput: () => {},
  resetEnvironment: () => {},
})

export const useCodeEnvironment = () => {
  return useContext(CodeEnvironmentContext)
}

export const CodeEnvironmentProvider = ({ children, problem }: CodeEnvironmentProviderProps) => {
  const [currentProblem, setCurrentProblem] = useState<Problem>(problem)
  const [currentLanguage, setCurrentLanguage] = useState('PYTHON')
  const [code, setCode] = useState(problem.codeTemplate ? `\n${problem.codeTemplate}` : '')
  const [testCases, setTestCases] = useState(problem.testCases)
  const [failingTests, setFailingTests] = useState([true])
  const [currentTestIndex, setCurrentTestIndex] = useState(1)
  const [submissionId, setSubmissionId] = useState(0)
  const [receivedOutput, setReceivedOutput] = useState<(string | number)[][]>([])
  const [resetValue, resetEnvironment] = useState(false)

  return (
    <CodeEnvironmentContext.Provider
      value={{
        problem: currentProblem,
        currentLanguage,
        code,
        testCases,
        failingTests,
        currentTestIndex,
        submissionId,
        receivedOutput,
        resetValue,
        setCurrentProblem,
        setCurrentLanguage,
        setCode,
        setTestCases,
        setFailingTests,
        setCurrentTestIndex,
        setSubmissionId,
        setReceivedOutput,
        resetEnvironment,
      }}
    >
      {children}
    </CodeEnvironmentContext.Provider>
  )
}
