/* eslint-disable no-unused-vars */
import clsx from 'clsx'
import classes from './account-page.module.scss'
import { useUser } from '../../../providers'
import { Avatar, List, ListItem, ListItemText } from '@mui/material'
import { Button, Seperator } from '../../utils'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Create, Refresh } from '@mui/icons-material'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserService } from '../../../services/user-service'
import { ProfileUserData, UserStatistics } from '../../../types'
import { ProblemChart } from './problem-chart'
import { ActivityChart } from './activity-chart'
import { LoadingPage } from '../loading-page/loading-page'

const AdminPanel = lazy(() => import('./admin-panel/admin-panel-modal'))
const SettingsButton = lazy(() => import('./settings-button'))

const tmpSubmissions = [
  { name: 'Problem proposal 1', status: 'Declined' },
  { name: 'Someones proposal 2', status: 'Approved' },
  { name: 'Someones proposal 3', status: 'Pending' },
  { name: 'Someones proposal 4', status: 'Approved' },
  { name: 'Someones proposal 5', status: 'Declined' },
  { name: 'Someones proposal 6', status: 'Pending' },
  { name: 'Someones proposal 7', status: 'Approved' },
  { name: 'Someones proposal 8', status: 'Declined' },
  { name: 'Someones proposal 9', status: 'Pending' },
  { name: 'Someones proposal 10', status: 'Approved' },
]

type Preferences = {
  language: string,
  timezone: string,
  darkMode: boolean,
  isProfilePublic: boolean
}

const AccountPage = () => {
  const { userId } = useParams<{ userId: string }>()
  const { userId: currentUserId, isAdmin } = useUser()
  const navigate = useNavigate()
  const [user, setUser] = useState<ProfileUserData>()
  const [userStatistics, setUserStatistics] = useState<UserStatistics>()
  const [openAdminPanel, setOpenAdminPanel] = useState(false)
  const [isOwnAccountPage, setIsOwnAccountPage] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSafari, setIsSafari] = useState<boolean>(false)

  useEffect(() => {
    const isUsingSafari =
      navigator.userAgent.toLowerCase().includes('safari')
      && !navigator.userAgent.toLowerCase().includes('chrome')

    setIsSafari(isUsingSafari)
  }, [])

  useEffect(() => {
    const fetchUser = async() => {
      setIsLoading(true)

      try {
        const userData = await UserService.getUserData(userId!)
        const userStatisticsData = await UserService.getUserStatistics(userId!)

        setUser(userData)
        setUserStatistics(userStatisticsData)

        if (userId === currentUserId) {
          const newPreferences: Preferences = {
            language: userData.preferences.language,
            timezone: userData.preferences.timezone,
            darkMode: userData.preferences.darkMode,
            isProfilePublic: userData.preferences.isProfilePublic,
          }

          setPreferences(newPreferences)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    setIsOwnAccountPage(userId === currentUserId)
    fetchUser()
  }, [userId])

  if (isLoading) {
    return (
      <div className='container scrollable'>
        <LoadingPage />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <h1>No user found</h1>
      </div>
    )
  }

  const handleOpenAdminModal = () => setOpenAdminPanel(true)
  const handleCloseAdminModal = () => setOpenAdminPanel(false)

  const completedProblems = userStatistics?.user_problem_attempts.filter(
    attempt => attempt.user_problem_status === 'SUCCEEDED'
  ) || []

  return (
    <main className={classes.mainContainer}>
      <div className={classes.accountPageContainer}>
        <section className={classes.topSection}>
          <div className={classes.topGrouping}>
            <div className={classes.userCard}>
              <Avatar
                alt={user.username}
                sx={{ width: 60, height: 60, fontSize: '2rem' }}
              />
              <header>{user.username}</header>
              <SettingsButton hideButton={!isOwnAccountPage} preferences={preferences}/>
            </div>
            <div className={classes.problemTypeChart}>
              <ProblemChart userStatistics={userStatistics} />
            </div>
          </div>
          {!isSafari && (
            <div className={classes.activityChart}>
              <ActivityChart userStatistics={userStatistics} />
            </div>
          )}
        </section>
        <section className={classes.bottomSection}>
          <div className={classes.solvedProblems}>
            <header>Completed problems</header>
            <List>
              {completedProblems.length ? (
                completedProblems.map((problem, index) => (
                  <li key={index}>
                    <ListItem component='button' onClick={() => navigate(`/problems/${problem.problem_id}`)}>
                      <ListItemText primary={problem.problem_name} />
                    </ListItem>
                  </li>
                ))
              ) : (
                <li className='container' key={'no-problems'}> This user has no problems solved</li>
              )}
            </List>
          </div>
          <div className={classes.submissionsAndAdminPanel}>
            <div className={classes.buttonGroup}>
              <Button
                icon={<Create />}
                popup={'Click to create new problem'}
                onClick={() => navigate('/problem-creator')}
                aria-label='problem-creator'
              >
                Add Problem
              </Button>
              <Button icon={<Refresh />} popup={'Click to refresh submissions'} aria-label='refresh-submissions'>
                Refresh
              </Button>
              <Button
                className={clsx({ ['hidden']: !isAdmin || !isOwnAccountPage })}
                icon={<AdminPanelSettingsIcon />}
                popup={'Click to open Admin Panel'}
                onClick={handleOpenAdminModal}
                aria-label='admin-panel'
                hidden={!isAdmin || !isOwnAccountPage}
              >
                Admin
              </Button>
            </div>
            <Seperator isHorizontal />
            <div className={classes.submissions}>
              <List>
                {tmpSubmissions.map((submission, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={submission.name} />
                    <span className={clsx('inside-shadow',
                      {
                        [classes.approved]: submission.status === 'Approved',
                        [classes.rejected]: submission.status === 'Declined'
                      }
                    )}>
                      {submission.status}
                    </span>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </section>
      </div>
      <Suspense>
        {openAdminPanel && <AdminPanel open={openAdminPanel} onClose={handleCloseAdminModal}/>}
      </Suspense>
    </main>
  )
}

export default AccountPage
