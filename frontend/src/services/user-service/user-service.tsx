import axios from 'axios'
import { ProfileUserData } from '../../types'
import { UserStatistics } from '../../types'

const getUserData = async(userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/user/${userId}`)
    const userData = response.data as ProfileUserData

    return userData
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserStatistics = async(userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/user/${userId}/statistics`)
    const userStatistics = response.data as UserStatistics

    return userStatistics
  } catch (error) {
    console.error(error)
    throw error
  }
}

const setUserPreferences = async(
  userId: string,
  preferences: {
    language: string,
    timezone: string,
    dark_mode: boolean,
    is_profile_public: boolean
  }
) => {
  try {
    const response = await axios.post(`http://localhost:8080/user/${userId}/preferences`, preferences)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserProblems = async(userId: string) => {
  try {
    const userStatistics = await getUserStatistics(userId)
    const problemData = [...userStatistics.user_problem_attempts]

    const problemDict = problemData.reduce((acc, problem) => {
      acc[problem.problem_id] = problem.user_problem_status
      return acc
    }, {} as { [key: string]: string })

    return problemDict
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return {}
  }
}

export const UserService = {
  getUserData,
  getUserStatistics,
  setUserPreferences,
  getUserProblems,
}
