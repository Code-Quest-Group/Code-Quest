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
  currentTemplate: string
  setCurrentTemplate: (template: string) => void
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
  currentTemplate: '',
  isPreview: false,
  setCurrentTemplate: () => {},
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
    const savedCode = localStorage.getItem(`saved_code_${problem.problemId}_${currentLanguage.toLowerCase()}`)
    return savedCode || (problem.codeTemplate ? `\n${problem.codeTemplate}` : '')
  })
  const [testCases, setTestCases] = useState(problem.exampleTestCases)
  const [currentTestIndex, setCurrentTestIndex] = useState(1)
  const [submissionId, setSubmissionId] = useState('')
  const [receivedOutput, setReceivedOutput] = useState<(string | number)[]>([])
  const [expectedResults, setExpectedResults] = useState<(string | number)[]>([])
  const [userStdout, setUserStdout] = useState<string[]>([])
  const [inputFormat] = useState(problem.inputFormat)
  const [currentTemplate, setCurrentTemplate] = useState<string>(problem.codeTemplate)

  useEffect(() => {
    if (problem?.problemId && problem.problemId !== 'preview-problem') {
      localStorage.setItem(`saved_code_${problem.problemId}_${currentLanguage.toLowerCase()}`, code)
    }
  }, [code, problem?.problemId, currentLanguage])

  const fetchSavedCode = () => {
    if (problem?.problemId && problem.problemId !== 'preview-problem') {
      return localStorage.getItem(`saved_code_${problem.problemId}_${currentLanguage.toLowerCase()}`)
    }
    return null
  }

  const resetCodeToTemplate = () => {
    if (currentTemplate) {
      setCode(`\n${currentTemplate}`)
    } else {
      setCode('')
    }
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    const savedCode = localStorage.getItem(`saved_code_${problem.problemId}_${language.toLowerCase()}`)
    if (savedCode) {
      setCode(savedCode)
    } else if (language.toUpperCase() === 'PYTHON') {
      setCode('class Problem:\n')
    } else if (language.toUpperCase() === 'JAVASCRIPT') {
      setCode('class Problem {\n}')
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
        currentTemplate,
        setCurrentTemplate,
        setCurrentProblem,
        setCurrentLanguage: handleLanguageChange,
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
