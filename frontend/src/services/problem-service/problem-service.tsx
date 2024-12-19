/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { Problem, Proposal } from '../../types'
import { config } from '../../../config'

const getProblems = async() => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/problems`)

    const problems: Problem[] = response.data.map((item: any) => ({
      problemId: item.problem_id,
      name: item.name,
      description: item.description,
      supportedLanguages: item.supported_languages,
      inputFormat: item.input_format,
      codeTemplate: item.code_template,
      exampleExpectedResults: item.example_expected_results,
      exampleTestCases: item.example_test_cases,
      hints: item.hints,
      tags: item.tags,
      rating: item.rating,
    }))

    return problems
  } catch (error) {
    console.error('Error fetching problems:', error)
    throw error
  }
}

const getProblem = async(problemId: string) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/problems/${problemId}`)
    const raw = response.data

    const problem: Problem = {
      name: raw.name,
      codeTemplate: raw.code_template,
      description: raw.description,
      hints: raw.hints,
      inputFormat: raw.input_format,
      problemId: raw.problem_id,
      supportedLanguages: raw.supported_languages,
      exampleTestCases: raw.example_testcases,
      exampleExpectedResults: raw.example_expected_result,
      tags: raw.tags,
      constraints: raw.constraints,
      rating: raw.rating,
      codeTemplates: raw.code_templates,
    }

    return problem

  } catch (error) {
    console.error('Error fetching problem:', error)
    throw error
  }
}

const getProposals = async() => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/problems/proposals`)

    const proposals: Proposal[] = response.data.map((item: any) => ({
      name: item.name,
      description: item.description,
      tags: item.tags,
      constraints: item.constraints,
      hints: item.hints,
      rating: item.rating,
      problem_id: item.problem_id,
      supported_languages: item.supported_languages,
      input_format: item.input_format,
      code_template: item.code_template,
      example_testcases: item.example_testcases,
      example_expected_result: item.example_expected_result,
      user_problem_details: item.user_problem_details,
      code_templates: item.code_templates,
      problem_status: item.problem_status,
      author: item.author,
    }))

    return proposals

  } catch (error) {
    console.error('Error fetching Proposals:', error)
    throw error
  }
}

export const ProblemService = {
  getProblems,
  getProblem,
  getProposals
}
