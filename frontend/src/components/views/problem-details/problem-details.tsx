import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'

export const ProblemDetails = () => {
  const { problemId } = useParams<{ problemId: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <main>
      <h1>{problem.name}</h1>
      <p>{problem.description}</p>
    </main>
  )
}
