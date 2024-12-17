/* eslint-disable no-unused-vars */
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts'
import { UserStatistics } from '../../../types'
import { Tags } from '../../../types/problem/tags.type'

type ProblemChartProps = {
    userStatistics?: UserStatistics
}

export const ProblemChart = ({ userStatistics }: ProblemChartProps) => {

  const emptyStatistics = userStatistics
    && Object.keys(userStatistics.submissions_frequency).length === 0
    && userStatistics.user_problem_attempts.length === 0
    && Object.keys(userStatistics.user_problem_tags_count).length === 0

  if (!userStatistics || emptyStatistics) {
    return (
      <ResponsiveContainer minWidth={'20rem'} className='container'>
        <header>No profile problem chart data</header>
      </ResponsiveContainer>
    )
  }

  const totalProblemsSolved = Object
    .values(userStatistics.user_problem_tags_count)
    .reduce((acc, curr) => acc + curr, 0)

  const chartData = Object
    .values(Tags)
    .map(problemType => ({
      problemType,
      amount: userStatistics.user_problem_tags_count[problemType] || 0,
      fullMark: totalProblemsSolved,
    }))

  return (
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
  )
}
