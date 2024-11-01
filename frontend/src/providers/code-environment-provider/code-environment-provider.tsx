/* eslint-disable no-unused-vars */
import { createContext, ReactNode, useContext, useState } from 'react'
import { Problem } from '../../types'

type CodeEnvironmentProviderProps = {
    children: ReactNode
    problem: Problem
}

type CodeEnvironmentContextType = {
    problem: Problem | undefined
    code: string
    testCases: string
    failingTests: boolean[]
    currentTestIndex: number
    setCurrentProblem: (problem: Problem) => void
    setCode: (code: string) => void
    setTestCases: (testCases: string) => void
    setFailingTests: (failingTests: boolean[]) => void
    setCurrentTestIndex: (index: number) => void
}

const CodeEnvironmentContext = createContext<CodeEnvironmentContextType>({
  problem: undefined,
  code: '',
  testCases: '',
  failingTests: [],
  currentTestIndex: 1,
  setCurrentProblem: () => {},
  setCode: () => {},
  setTestCases: () => {},
  setFailingTests: () => {},
  setCurrentTestIndex: () => {},
})

export const useCodeEnvironment = () => {
  return useContext(CodeEnvironmentContext)
}

export const CodeEnvironmentProvider = ({ children, problem }: CodeEnvironmentProviderProps) => {
  const [currentProblem, setCurrentProblem] = useState<Problem | undefined>(problem)
  const [code, setCode] = useState(problem.codeTemplate ? `\n${problem.codeTemplate}` : '')
  const [testCases, setTestCases] = useState(problem.testCases)
  const [failingTests, setFailingTests] = useState([true])
  const [currentTestIndex, setCurrentTestIndex] = useState(1)

  return (
    <CodeEnvironmentContext.Provider
      value={{
        problem: currentProblem,
        code,
        testCases,
        failingTests,
        currentTestIndex,
        setCurrentProblem,
        setCode,
        setTestCases,
        setFailingTests,
        setCurrentTestIndex,
      }}
    >
      {children}
    </CodeEnvironmentContext.Provider>
  )
}
