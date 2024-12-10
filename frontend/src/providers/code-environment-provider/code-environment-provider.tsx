/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Problem } from '../../types'

type CodeEnvironmentProviderProps = {
  children: ReactNode
  problem: Problem
  isPreview?: boolean
}

type CodeEnvironmentContextType = {
  problem: Problem
  code: string
  currentLanguage: string
  testCases: string
  currentTestIndex: number
  submissionId: string;
  receivedOutput: (string | number)[]
  inputFormat: string
  isPreview: boolean;
  expectedResults: (string | number)[]
  userStdout: (string)[]
  setCurrentProblem: (problem: Problem) => void
  setCurrentLanguage: (language: string) => void
  setCode: (code: string) => void
  setTestCases: (testCases: string) => void
  setCurrentTestIndex: (index: number) => void
  setSubmissionId: (id: string) => void
  setReceivedOutput: (output: (string | number)[]) => void
  setExpectedResults: (results: (string | number)[]) => void
  setUserStdout: (userStdout: (string)[]) => void
  fetchSavedCode: () => string | null
  resetCodeToTemplate: () => void
}

const CodeEnvironmentContext = createContext<CodeEnvironmentContextType>({
  problem: {} as Problem,
  code: '',
  currentLanguage: '',
  testCases: '',
  currentTestIndex: 1,
  submissionId: '',
  receivedOutput: [],
  inputFormat: '',
  expectedResults: [],
  userStdout: [],
  isPreview: false,
  setCurrentProblem: () => {},
  setCurrentLanguage: () => {},
  setCode: () => {},
  setTestCases: () => {},
  setCurrentTestIndex: () => {},
  setSubmissionId: () => {},
  setReceivedOutput: () => {},
  setExpectedResults: () => {},
  setUserStdout: () => {},
  fetchSavedCode: () => null,
  resetCodeToTemplate: () => {},
})

export const useCodeEnvironment = () => {
  return useContext(CodeEnvironmentContext)
}

export const CodeEnvironmentProvider = ({ children, problem, isPreview = false }: CodeEnvironmentProviderProps) => {
  const [currentProblem, setCurrentProblem] = useState<Problem>(problem)
  const [currentLanguage, setCurrentLanguage] = useState('PYTHON')
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(`savedCode${problem.problemId}`)
    return savedCode || (problem.codeTemplate ? `\n${problem.codeTemplate}` : '')
  })
  const [testCases, setTestCases] = useState(problem.exampleTestCases)
  const [currentTestIndex, setCurrentTestIndex] = useState(1)
  const [submissionId, setSubmissionId] = useState('')
  const [receivedOutput, setReceivedOutput] = useState<(string | number)[]>([])
  const [expectedResults, setExpectedResults] = useState<(string | number)[]>([])
  const [userStdout, setUserStdout] = useState<(string)[]>([])
  const [inputFormat, _] = useState(problem.inputFormat)

  useEffect(() => {
    if (problem?.problemId && problem.problemId !== 'preview-problem') {
      localStorage.setItem(`savedCode${problem.problemId}`, code)
    }
  }, [code, problem?.problemId])

  const fetchSavedCode = () => {
    if (problem?.problemId && problem.problemId !== 'preview-problem') {
      return localStorage.getItem(`savedCode${problem.problemId}`)
    }
    return null
  }

  const resetCodeToTemplate = () => {
    if (problem?.codeTemplate) {
      setCode(`\n${problem.codeTemplate}`)
    } else {
      setCode('')
    }
  }

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
        inputFormat,
        isPreview,
        expectedResults,
        userStdout,
        setCurrentProblem,
        setCurrentLanguage,
        setCode,
        setTestCases,
        setCurrentTestIndex,
        setSubmissionId,
        setReceivedOutput,
        setExpectedResults,
        setUserStdout,
        fetchSavedCode,
        resetCodeToTemplate,
      }}
    >
      {children}
    </CodeEnvironmentContext.Provider>
  )
}
