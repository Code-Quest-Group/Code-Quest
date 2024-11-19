import { Activity } from 'react-activity-calendar'
import { Problem } from '../problem/problem.type'

export type User = {
    username: string
    userId?: string
    email?: string
    createdAt?: string
    lastLogin?: string
    role?: 'ADMIN' | 'USER' // ofc zakladamy ze security polega na tokenie, wiec to bedzie tylko do UI'owych zmian
    completedProblems?: Problem[] // brakuje
    privateProfile?: boolean // brakuje (uzyteczne tylko dla UI bo logika pobierania danych bedzie chyba backendowa)
    activity?: Activity[] // do diagramu aktywnosci
}
