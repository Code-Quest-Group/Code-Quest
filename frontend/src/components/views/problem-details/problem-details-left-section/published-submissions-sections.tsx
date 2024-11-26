import { useEffect, useState } from 'react'
import { useCodeEnvironment } from '../../../../providers'
import axios from 'axios'
import { PublishedSubmission } from '../../../../types/problem/published-submission.type'
import classes from './published-submissions.module.scss'
import { Seperator } from '../../../utils'

export const PublishedSubmissionsSection = () => {
  const { problem } = useCodeEnvironment()
  const [submissions, setSubmissions] = useState<PublishedSubmission[]>([])
  const problemId = problem.problemId

  useEffect(() => {
    const fetchPublishedSubmissions = async() => {
      try {
        const response = await axios.get(
          `http://localhost:8080/problems/${problemId}/published-submissions`
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
              <header className="header">Author: {submission.username}</header>

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
