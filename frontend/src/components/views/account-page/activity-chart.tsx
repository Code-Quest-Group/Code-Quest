import ActivityCalendar from 'react-activity-calendar'
import { UserStatistics } from '../../../types'

const determineLevel = (count: number, maxCount: number) => {
  const percentage = (count / maxCount) * 100

  if (percentage <= 25) return 1
  if (percentage <= 50) return 2
  if (percentage <= 75) return 3
  return 4
}

const getYearRange = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 2)
  const lastDayOfYear = new Date(date.getFullYear(), 11, 32)

  return {
    firstDayOfYear: firstDayOfYear.toISOString().split('T')[0],
    lastDayOfYear: lastDayOfYear.toISOString().split('T')[0],
  }
}

type ActivityChartProps = {
    userStatistics?: UserStatistics
}

export const ActivityChart = ({ userStatistics }: ActivityChartProps) => {

  if (!userStatistics) {
    return (
      <h1> no data man </h1>
    )
  }

  const maxActivity = Math.max(...Object.values(userStatistics.submissions_frequency))
  const { firstDayOfYear, lastDayOfYear } = getYearRange(new Date())

  const activityData = Object
    .entries(userStatistics.submissions_frequency)
    .map(([date, count]) => ({
      date,
      count,
      level: determineLevel(count, maxActivity),
    }))
    .concat([
      { date: firstDayOfYear, count: 0, level: 0 },
      { date: lastDayOfYear, count: 0, level: 0 },
    ])
    .filter((item, index, self) => self.findIndex(i => i.date === item.date) === index)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <ActivityCalendar
      data={activityData}
      theme={{ dark: ['#bbb8e3', '#0b03fc']}}
      showWeekdayLabels
      blockRadius={20}
      blockMargin={6}
    />
  )
}
