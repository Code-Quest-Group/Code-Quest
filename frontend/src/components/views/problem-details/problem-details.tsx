import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLayout } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import { Seperator } from '../../utils'
import classes from './problem-details.module.scss'

export const ProblemDetails = () => {
  const { problemId } = useParams<{ problemId: string }>()
  const [selectedSection, setSelectedSection] = useState('description')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showNavbar } = useLayout()

  useEffect(() => {
    const fetchProblem = async() => {
      setLoading(true)
      setError(null)
      try {
        const fetchedProblem = await ProblemService.getProblem(problemId) // gonna make context later maybe
        setProblem(fetchedProblem)
      } catch (error) {
        setError('Failed to fetch problem data ' + error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  if (!problem) {
    return <h1>Problem Not Found</h1>
  }

  return (
    <main className={clsx(classes.problemDetailsContainer, {'full-height': !showNavbar})}>
      <div className={classes.leftSection}>
        <div className={classes.headerSection}>
          <button
            className={clsx({[classes.selected]: selectedSection === 'description'})}
            onClick={() => setSelectedSection('description')}
          >
            Description
          </button>
          <Seperator />
          <button
            className={clsx({[classes.selected]: selectedSection === 'hints'})}
            onClick={() => setSelectedSection('hints')}
          >
            Hints
          </button>
          <Seperator />
          <button
            className={clsx({[classes.selected]: selectedSection === 'pseudocode'})}
            onClick={() => setSelectedSection('pseudocode')}
          >
            Pseudocode
          </button>
          <Seperator />
          <button
            className={clsx({[classes.selected]: selectedSection === 'solutions'})}
            onClick={() => setSelectedSection('solutions')}>
            User Solutions
          </button>
        </div>
        <span>{problem.name}</span>
        <p>{problem.description}</p>
      </div>
      <Seperator />
      <div className={classes.rightSection}>
        <div className={classes.headerSection}>
          <span>Coding Workspace</span>
        </div>
      </div>
    </main>
  )
}
