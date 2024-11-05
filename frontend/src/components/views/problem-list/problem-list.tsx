import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLayout } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([ ])
  const { showNavbar } = useLayout()

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
    <main className={clsx({'full-height': !showNavbar})}>
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

export default ProblemList
