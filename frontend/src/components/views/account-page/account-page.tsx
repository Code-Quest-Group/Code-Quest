/* eslint-disable no-unused-vars */
import clsx from 'clsx'
import classes from './account-page.module.scss'
import { useLayout, useUser } from '../../../providers'
import { Avatar, List, ListItem, ListItemText } from '@mui/material'
import { Button, Seperator } from '../../utils'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Create, Refresh } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { AdminPanel } from './admin-panel'
import { useNavigate, useParams } from 'react-router-dom'
import { SettingsButton } from './settings-button'
import { UserService } from '../../../services/user-service'
import { ProfileUserData, UserStatistics } from '../../../types'
import { ProblemChart } from './problem-chart'
import { ActivityChart } from './activity-chart'

const tmpProblems = [
  { name: 'Add two numbers', href: '/problems/add-two-numbers' },
  { name: 'Binary Search', href: '/problems/binary-search' },
  { name: 'Graph Traversal', href: '/problems/graph-traversal' },
  { name: 'Dynamic Programming', href: '/problems/dynamic-programming' },
  { name: 'Greedy Algorithm', href: '/problems/greedy-algorithm' },
  { name: 'Backtracking', href: '/problems/backtracking' },
  { name: 'String Manipulation', href: '/problems/string-manipulation' },
  { name: 'Array Operations', href: '/problems/array-operations' },
  { name: 'Hashing Techniques', href: '/problems/hashing-techniques' },
  { name: 'Divide and Conquer', href: '/problems/divide-and-conquer' },
  { name: 'Tree Traversal', href: '/problems/tree-traversal' },
  { name: 'Matrix Multiplication', href: '/problems/matrix-multiplication' },
  { name: 'Bit Manipulation', href: '/problems/bit-manipulation' },
  { name: 'Recursion Basics', href: '/problems/recursion-basics' },
  { name: 'Queue Operations', href: '/problems/queue-operations' },
  { name: 'Stack Implementation', href: '/problems/stack-implementation' },
  { name: 'Linked List Basics', href: '/problems/linked-list-basics' },
  { name: 'Heap Operations', href: '/problems/heap-operations' },
  { name: 'Trie Implementation', href: '/problems/trie-implementation' },
  { name: 'Network Flow Algorithms', href: '/problems/network-flow-algorithms' }
]

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
  const { showNavbar } = useLayout()
  const navigate = useNavigate()
  const [user, setUser] = useState<ProfileUserData>()
  const [userStatistics, setUserStatistics] = useState<UserStatistics>()
  const [openAdminPanel, setOpenAdminPanel] = useState(false)
  const [isOwnAccountPage, setIsOwnAccountPage] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>()

  useEffect(() => {
    const fetchUser = async() => {
      try {
        const userData = await UserService.getUserData(userId!)
        const userStatisticsData = await UserService.getUserStatistics(userId!)

        setUser(userData)
        setUserStatistics(userStatisticsData)
        console.log(userStatisticsData)

        if (userId === currentUserId) {
          const newPreferences: Preferences = {
            language: userData.preferences.language,
            timezone: userData.preferences.timezone,
            darkMode: userData.preferences.darkMode,
            isProfilePublic: userData.preferences.isProfilePublic
          }

          setPreferences(newPreferences)
        }
      } catch(err) {
        console.log(err)
      }
    }

    setIsOwnAccountPage(userId === currentUserId)
    fetchUser()
  }, [userId])

  if (!user) return <div className='container'>No user found</div>

  const handleOpenAdminModal = () => setOpenAdminPanel(true)
  const handleCloseAdminModal = () => setOpenAdminPanel(false)

  return (
    <main className={clsx({'full-height': !showNavbar})}>
      <div className={classes.accountPageContainer}>
        <section className={classes.topSection}>
          <div className={classes.topGrouping}>
            <div className={classes.userCard}>
              <Avatar
                alt={user.username}
                src="path... maybe"
                sx={{ width: 60, height: 60, fontSize: '2rem' }}
              />
              <header>{user.username}</header>
              <SettingsButton hideButton={!isOwnAccountPage} preferences={preferences}/>
            </div>
            <div className={classes.problemTypeChart}>
              <ProblemChart userStatistics={userStatistics} />
            </div>
          </div>
          <div className={classes.activityChart}>
            <ActivityChart userStatistics={userStatistics} />
          </div>
        </section>
        <section className={classes.bottomSection}>
          <div className={classes.solvedProblems}>
            <header>Completed problems</header>
            <List>
              {tmpProblems.map((problem, index) => (
                <li key={index}>
                  <ListItem component="a" href={problem.href}>
                    <ListItemText primary={problem.name} />
                  </ListItem>
                </li>
              ))}
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
      <AdminPanel open={openAdminPanel} onClose={handleCloseAdminModal}/>
    </main>
  )
}

export default AccountPage
