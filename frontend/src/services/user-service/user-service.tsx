import axios from 'axios'
import { ProfileUserData } from '../../types'
import { UserStatistics } from '../../types'

const getUserData = async(userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/user/${userId}`)
    const userData = response.data as ProfileUserData

    return userData
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getUserStatistics = async(userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/user/${userId}/statistics`)
    const userStatistics = response.data as UserStatistics

    return userStatistics
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const UserService = {
  getUserData,
  getUserStatistics
}
