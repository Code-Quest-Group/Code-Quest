import { Activity } from 'react-activity-calendar'
import { Problem } from '../problem/problem.type'

export type User = {
    username: string
    userId?: string
    email?: string
    createdAt?: string
    lastLogin?: string
    role?: 'ADMIN' | 'USER'
    completedProblems?: Problem[]
    privateProfile?: boolean
    activity?: Activity[]
}
