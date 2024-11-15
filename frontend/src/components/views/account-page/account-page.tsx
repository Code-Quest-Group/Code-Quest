import clsx from 'clsx'
import classes from './account-page.module.scss'
import { useLayout, useUser } from '../../../providers'
import { Avatar, Button, Typography } from '@mui/material'
import ActivityCalendar from 'react-activity-calendar'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'

const data = [
  {
    date:'2024-01-01',
    count: 3,
    level: 1
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

const chartData = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
]

const AccountPage = () => {
  const { username } = useUser()
  const { showNavbar } = useLayout()

  return (
    <main className={clsx({'full-height': !showNavbar})}>
      <div className={classes.accountPageContainer}>
        <section className={classes.topSection}>
          <div className={classes.userCard}>
            <Avatar
              alt={username}
              src="path... maybe"
              sx={{ width: 60, height: 60, fontSize: '2rem' }}
            />
            <header>{username}</header>
            <Button
              onClick={() => window.alert('Not implemened 😇')}
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Settings
              </Typography>
            </Button>
          </div>
          <div className={classes.problemTypeChart}>
            <ResponsiveContainer minWidth={'12rem'}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
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
      </div>
    </main>
  )
}

export default AccountPage
