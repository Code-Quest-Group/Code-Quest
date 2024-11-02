import { CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useCodeEnvironment } from '../../../providers'
import { SubmissionResponse } from '../../../types'
import { Button } from '../../utils'
import { parseRawResults } from './problem-details.utils'

type SubmitButtonGroupProps = {
    className: string
}

export const SubmitButtonGroup = ({ className }: SubmitButtonGroupProps) => {
  const { code, problem, submissionId, setSubmissionId, setReceivedOutput } = useCodeEnvironment()

  const inputFormat = problem?.inputFormat.includes('int') ? 'int' : 'string'

  const handleSubmit = async() => {
    try {
      const response = await axios.post('http://localhost:8080/submissions/', {
        sourceCode: code,
        problemId: problem?.problemId,
        language: 'PYTHON',
      })

      if (response.status === 200) {
        const submissionId = response.data.submission_id
        toast.info('Submission successful')
        setSubmissionId(submissionId)
      } else {
        toast.error('Submission failed to send')
      }
    } catch (error) {
      console.error('Error submitting:', error)
    }
  }

  useEffect(() => {
    if (!submissionId) return

    const pollInterval = setInterval(async() => {
      try {
        const response = await axios.get(`http://localhost:8080/submissions/${submissionId}`)
        if (response.status === 200) {
          const payload: SubmissionResponse = response.data
          clearInterval(pollInterval)
          setSubmissionId(0)

          if (payload.status === 'ACCEPTED') {
            toast.success(`Passed tests cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'WRONG_ANSWER') {
            toast.warning(`Passed tests cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'RUNTIME_ERROR_NZEC') {
            toast.error(`Runtime error! ${payload.stderr}`, {autoClose: false})
          }

          const receivedOutput = payload.stdout
            ? parseRawResults(payload.stdout, inputFormat)
            : Array(problem?.testCases.length).fill(null)

          setReceivedOutput(receivedOutput)

        }
      } catch (error) {
        console.error('Error polling submission status:', error)
      }
    }, 1000)

    return () => clearInterval(pollInterval)
  }, [submissionId])

  return (
    <div className={className}>
      <Button onClick={() => window.alert('Not implemened 😇')}>
        <Typography variant="button" style={{ textTransform: 'none' }}>
           Custom Test Case
        </Typography>
      </Button>
      <Button onClick={() => window.alert('Not implemened 😇')}>
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Run Test Case
        </Typography>
      </Button>
      <Button onClick={handleSubmit} disabled={Boolean(submissionId)} style={{ position: 'relative', width: '7rem' }}>
        {submissionId ? (
          <CircularProgress size={24} style={{ position: 'absolute', color: 'white' }} />
        ) : (
          <Typography variant="button" style={{ textTransform: 'none' }}>
          Submit
          </Typography>
        )}
      </Button>
    </div>
  )
}
