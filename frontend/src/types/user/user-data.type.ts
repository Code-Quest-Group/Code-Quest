export type ProfileUserData = {
    userId: string
    username: string
    email: string
    userRole: 'ADMIN' | 'USER'
    fullName: string
    country: string
    createdAt: string
    lastLogin: string
    banned?: boolean
    preferences: {
      darkMode: boolean
      isProfilePublic: boolean
      language: string
      timezone: string
    }
}
