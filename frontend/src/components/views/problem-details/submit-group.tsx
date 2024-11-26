import { CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useCodeEnvironment, useUser } from '../../../providers'
import { SubmissionResponse } from '../../../types'
import { Button } from '../../utils'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { CustomTestButton } from './custom-test-button'
import { RunTestCasesButton } from './run-test-cases-button'

type SubmitButtonGroupProps = {
    className: string
}

export const SubmitButtonGroup = ({ className }: SubmitButtonGroupProps) => {
  const { code, problem, submissionId, setSubmissionId } = useCodeEnvironment()
  const { username } = useUser()

  const handleSubmit = async() => {
    if (username === '') {
      toast.warning('Please log in to submit')
      return
    }

    try {
      const response = await axios.post('http://localhost:8080/submissions/', {
        source_code: code,
        problem_id: problem?.problemId,
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
    if (submissionId === '' || submissionId.includes('custom')) return

    let attempts = 0

    const pollInterval = setInterval(async() => {
      try {
        attempts += 1

        if (attempts > 30) {
          clearInterval(pollInterval)
          toast.error('Failed to get back submission results')
          console.warn('Polling stopped after 30 attempts')
          setSubmissionId('')
          return
        }

        const params = {
          params: {
            submissionId,
            problemId: problem?.problemId,
            language: 'PYTHON'
          }
        }

        const response = await axios.get('http://localhost:8080/submissions', params)

        if (response.status === 200 && response.data) {
          const payload: SubmissionResponse = response.data[0]

          if (payload.status === 'ACCEPTED') {
            toast.success(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'WRONG_ANSWER') {
            toast.warning(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'RUNTIME_ERROR_NZEC') {
            toast.error(`Runtime error! ${payload.stderr}`, { autoClose: false })
          }

          if (payload.status !== 'PROCESSING') {
            clearInterval(pollInterval)
            setSubmissionId('')
          }
        }
      } catch (error) {
        console.error('Error polling submission status:', error)
      }
    }, 250)

    return () => clearInterval(pollInterval)
  }, [submissionId])

  return (
    <div className={className}>
      <CustomTestButton />
      <RunTestCasesButton />
      <Button
        onClick={handleSubmit}
        disabled={Boolean(submissionId)}
        style={{ position: 'relative', width: '8rem' }}
        popup={'Click to submit solution'}
        icon={submissionId !== '' ?
          <CircularProgress size={20} style={{color: 'white'}}/>
          : <PlayCircleFilledWhiteIcon />
        }
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
        Submit
        </Typography>
      </Button>
    </div>
  )
}
