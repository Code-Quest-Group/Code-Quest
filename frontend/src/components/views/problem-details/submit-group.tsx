import { CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useCodeEnvironment, useUser } from '../../../providers'
import { SubmissionResponse } from '../../../types'
import { Button } from '../../utils'
import { parseRawResults } from './problem-details.utils'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditNoteIcon from '@mui/icons-material/EditNote';

type SubmitButtonGroupProps = {
    className: string
}

export const SubmitButtonGroup = ({ className }: SubmitButtonGroupProps) => {
  const { code, problem, submissionId, setSubmissionId, setReceivedOutput } = useCodeEnvironment()
  const { username } = useUser()

  const inputFormat = problem?.inputFormat.includes('int') ? 'int' : 'string'

  const handleSubmit = async() => {
    if (username === '') {
      toast.warning("Please log in to submit")
      return
    }
    
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

    let attempts = 0

    const pollInterval = setInterval(async() => {
      try {
        attempts += 1

        if (attempts > 30) {
          clearInterval(pollInterval)
          toast.error('Failed to get back submission results')
          console.warn('Polling stopped after 30 attempts')
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

        if (response.status === 200) {
          const payload: SubmissionResponse = response.data[0]
          clearInterval(pollInterval)
          setSubmissionId(0)

          if (payload.status === 'ACCEPTED') {
            toast.success(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'WRONG_ANSWER') {
            toast.warning(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'RUNTIME_ERROR_NZEC') {
            toast.error(`Runtime error! ${payload.stderr}`, { autoClose: false })
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
      <Button 
        onClick={() => window.alert('Not implemened 😇')} 
        icon={<EditNoteIcon />}
        popup={'Click to run custom test case'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
           Custom Test Case
        </Typography>
      </Button>
      <Button 
        onClick={() => window.alert('Not implemened 😇')} 
        icon={<PlayArrowIcon />}
        popup={'Click to run test case'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Run Test Case
        </Typography>
      </Button>
      <Button 
        onClick={handleSubmit} 
        disabled={Boolean(submissionId)}
        style={{ position: 'relative', width: '8rem' }}
        popup={'Click to submit solution'}
        icon={submissionId ? 
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
