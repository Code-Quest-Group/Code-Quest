import axios from 'axios'
import { ProfileUserData } from '../../types'
import { UserStatistics } from '../../types'
import { config } from '../../../config'

const getUserData = async(userId: string) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/user/${userId}`)
    const userData = response.data as ProfileUserData

    return userData
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserStatistics = async(userId: string, token?: string) => {
  try {
    const specialConfig = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined

    const response = await axios.get(`${config.apiBaseUrl}/user/${userId}/statistics`, specialConfig)
    const userStatistics = response.data as UserStatistics

    return userStatistics
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return {
      submissions_frequency: {},
      user_problem_attempts: [],
      user_problem_tags_count: {}
    } as UserStatistics
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
    const response = await axios.post(`${config.apiBaseUrl}/user/${userId}/preferences`, preferences)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserProblems = async(userId: string, token?: string) => {
  try {
    const userStatistics = await getUserStatistics(userId, token)
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

const getAllUsers = async() => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/user`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const banUser = async (userId: string) => {
  try {
    const response = await axios.patch(`${config.apiBaseUrl}/user/${userId}/ban`)
    return response.data
  } catch (error) {
    console.error(`Failed to ban user with ID: ${userId}`, error)
    throw error
  }
}

const unbanUser = async (userId: string) => {
  try {
    const response = await axios.patch(`${config.apiBaseUrl}/user/${userId}/unban`)
    return response.data
  } catch (error) {
    console.error(`Failed to unban user with ID: ${userId}`, error)
    throw error
  }
}

export const UserService = {
  getUserData,
  getUserStatistics,
  setUserPreferences,
  getUserProblems,
  getAllUsers,
  banUser,
  unbanUser
}
