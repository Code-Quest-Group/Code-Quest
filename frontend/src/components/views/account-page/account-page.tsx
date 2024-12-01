import clsx from 'clsx'
import classes from './account-page.module.scss'
import { useLayout, useUser } from '../../../providers'
import { Avatar, List, ListItem, ListItemText, Typography } from '@mui/material'
import ActivityCalendar from 'react-activity-calendar'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button, Seperator } from '../../utils'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Create, Refresh } from '@mui/icons-material'
import { useState } from 'react'
import { AdminPanel } from './admin-panel'
import { useNavigate } from 'react-router-dom'
import { SettingsButton } from './settings-button'

const data = [
  {
    date:'2024-01-01',
    count: 3,
    level: 2
  },
  {
    date: '2024-06-23',
    count: 2,
    level: 1,
  },
  {
    date: '2024-08-02',
    count: 16,
    level: 4,
  },
  {
    date: '2024-11-29',
    count: 11,
    level: 3,
  },
]

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

const AccountPage = () => {
  const [openAdminPanel, setOpenAdminPanel] = useState(false)
  const { username, isAdmin } = useUser()
  const { showNavbar } = useLayout()
  const navigate = useNavigate()

  const handleOpenAdminModal = () => setOpenAdminPanel(true)
  const handleCloseAdminModal = () => setOpenAdminPanel(false)

  const TOTAL_PROBLEMS_SOLVED = 150

  const chartData = [
    {
      problemType: 'Binary Search',
      amount: 120,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
    {
      problemType: 'Linked Lists',
      amount: 98,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
    {
      problemType: 'Recursion',
      amount: 10,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
    {
      problemType: 'Dynamic Programming',
      amount: 99,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
    {
      problemType: 'Graphs',
      amount: 85,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
    {
      problemType: 'Sorting',
      amount: 65,
      fullMark: TOTAL_PROBLEMS_SOLVED,
    },
  ]

  return (
    <main className={clsx({'full-height': !showNavbar})}>
      <div className={classes.accountPageContainer}>
        <section className={classes.topSection}>
          <div className={classes.topGrouping}>
            <div className={classes.userCard}>
              <Avatar
                alt={username}
                src="path... maybe"
                sx={{ width: 60, height: 60, fontSize: '2rem' }}
              />
              <header>{username}</header>
              <SettingsButton currentUsername={''}/>
            </div>
            <div className={classes.problemTypeChart}>
              <ResponsiveContainer minWidth={'20rem'}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="problemType" />
                  <Radar
                    name="Number of solved problems"
                    dataKey="amount"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={classes.activityChart}>
            <ActivityCalendar
              data={data}
              theme={{ dark: ['#bbb8e3', '#0b03fc']}}
              showWeekdayLabels
              blockRadius={20}
              blockMargin={6}
            />
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
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Add Problem
                </Typography>
              </Button>
              <Button icon={<Refresh />} popup={'Click to refresh submissions'} aria-label='refresh-submissions'>
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Refresh
                </Typography>
              </Button>
              <Button
                className={clsx({ 'hidden': !isAdmin })}
                icon={<AdminPanelSettingsIcon />}
                popup={'Click to open Admin Panel'}
                onClick={handleOpenAdminModal}
                aria-label='admin-panel'
              >
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Admin
                </Typography>
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
