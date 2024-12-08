import { useEffect, useState } from 'react'
import { useCodeEnvironment } from '../../../../providers'
import axios from 'axios'
import { PublishedSubmission } from '../../../../types/problem/published-submission.type'
import classes from './published-submissions.module.scss'
import { Seperator } from '../../../utils'
import { useNavigate } from 'react-router-dom'
import { config } from '../../../../../config'

export const PublishedSubmissionsSection = () => {
  const { problem } = useCodeEnvironment()
  const [submissions, setSubmissions] = useState<PublishedSubmission[]>([])
  const problemId = problem.problemId
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPublishedSubmissions = async() => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/problems/${problemId}/published-submissions`
        )

        const fetchedSubmissions = response.data as PublishedSubmission[]
        setSubmissions(fetchedSubmissions)
      } catch (error) {
        console.error('Error fetching published submissions:', error)
      }
    }

    if (problemId) {
      fetchPublishedSubmissions()
    }
  }, [])

  return (
    <div className={classes.solutionsContainer}>
      <header>Published Solutions</header>
      <Seperator isHorizontal />
      <section>
        {submissions.length > 0 ? (
          submissions.map((submission, index) => (
            <div key={index}>
              <header className="header">Author:{' '}
                <button onClick={() => navigate(`/account/${submission.user_id}`)}>
                  {submission.username}
                </button>
              </header>

              <p>
                <small>
                  Time:{' '}
                  {submission.time}s
                </small>
                <small>
                  Memory:{' '}
                  {submission.memory}
                </small>
              </p>

              <pre>
                <code>{submission.code}</code>
              </pre>

              <p>
                <small>
                  Submitted on:{' '}
                  {submission.date}
                </small>
              </p>
            </div>
          ))
        ) : (
          <p>No published submissions available</p>
        )}
      </section>
    </div>
  )
}
