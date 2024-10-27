import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'

export const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([ ])

  useEffect(() => {
    const fetchProblems = async() => {
      try {
        const data = await ProblemService.getProblems()
        setProblems(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProblems()
  }, [])

  return (
    <main>
      <h1>Problems</h1>
      <ul>
        {problems.map((problem, index) => (
          <li key={index}>
            <Link to={`/problems/${problem.problemId}`}>{problem.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
