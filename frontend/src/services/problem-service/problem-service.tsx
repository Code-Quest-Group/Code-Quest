import axios from 'axios'
import { Problem } from '../../types'

const getProblems = async() => {
  try {
    const response = await axios.get('http://localhost:8080/problems')

    const problems: Problem[] = response.data.map((item: Problem) => ({
      problemId: item.problemId,
      name: item.name,
      description: item.description,
      supportedLanguages: item.supportedLanguages,
      inputFormat: item.inputFormat,
      codeTemplate: item.codeTemplate,
      testCases: item.testCases,
      expectedResult: item.expectedResult,
    }))

    return problems
  } catch (error) {
    console.error('Error fetching problems:', error)
    throw error
  }
}

const getProblem = async(problemId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/problems/${problemId}`)
    const problem = response.data as Problem

    return problem

  } catch (error) {
    console.error('Error fetching problem:', error)
    throw error
  }
}

export const ProblemService = {
  getProblems,
  getProblem
}
