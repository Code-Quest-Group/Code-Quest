/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Problem } from '../../types'

type CodeEnvironmentProviderProps = {
  children: ReactNode;
  problem: Problem;
};

type CodeEnvironmentContextType = {
  problem: Problem;
  code: string;
  currentLanguage: string;
  testCases: string;
  currentTestIndex: number;
  submissionId: string;
  receivedOutput: (string | number)[];
  inputFormat: string;
  expectedResults: (string | number)[];
  setCurrentProblem: (problem: Problem) => void;
  setCurrentLanguage: (language: string) => void;
  setCode: (code: string) => void;
  setTestCases: (testCases: string) => void;
  setCurrentTestIndex: (index: number) => void;
  setSubmissionId: (id: string) => void;
  setReceivedOutput: (output: (string | number)[]) => void;
  setExpectedResults: (results: (string | number)[]) => void;
  fetchSavedCode: () => string | null;
  resetCodeToTemplate: () => void;
};

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
  setCurrentProblem: () => {},
  setCurrentLanguage: () => {},
  setCode: () => {},
  setTestCases: () => {},
  setCurrentTestIndex: () => {},
  setSubmissionId: () => {},
  setReceivedOutput: () => {},
  setExpectedResults: () => {},
  fetchSavedCode: () => null,
  resetCodeToTemplate: () => {},
})

export const useCodeEnvironment = () => {
  return useContext(CodeEnvironmentContext)
}

export const CodeEnvironmentProvider = ({ children, problem }: CodeEnvironmentProviderProps) => {
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
  const [inputFormat, _] = useState(problem.inputFormat)

  useEffect(() => {
    if (problem?.problemId) {
      localStorage.setItem(`savedCode${problem.problemId}`, code)
    }
  }, [code, problem?.problemId])

  const fetchSavedCode = () => {
    if (problem?.problemId) {
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
        expectedResults,
        setCurrentProblem,
        setCurrentLanguage,
        setCode,
        setTestCases,
        setCurrentTestIndex,
        setSubmissionId,
        setReceivedOutput,
        setExpectedResults,
        fetchSavedCode,
        resetCodeToTemplate, // Provide the reset function
      }}
    >
      {children}
    </CodeEnvironmentContext.Provider>
  )
}
