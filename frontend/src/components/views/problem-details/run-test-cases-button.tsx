import { CircularProgress } from '@mui/material'
import { Button } from '../../utils'
import { PlayArrow } from '@mui/icons-material'
import { useCodeEnvironment, useUser } from '../../../providers'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

export const RunTestCasesButton = () => {
  const {
    code,
    currentLanguage,
    problem,
    testCases,
    setSubmissionId,
    submissionId,
    setExpectedResults,
    setReceivedOutput,
    isPreview
  } = useCodeEnvironment()
  const { username } = useUser()

  const handleRunTestCases = async() => {
    if (username === '') {
      toast.warning('Please log in to submit')
      return
    }

    try {
      const response = await axios.post('http://localhost:8080/submissions/custom', {
        language: currentLanguage,
        source_code: code,
        problem_id: problem.problemId,
        custom_testcases: testCases,
      })

      if (response.status === 200 && response.data?.submission_id) {
        setSubmissionId(response.data.submission_id)
        toast.info('Submission successfuly sent')
      } else {
        toast.error('Failed to start submission')
      }
    } catch (error) {
      console.error('Error running test cases:', error)
      toast.error('Error while submitting test cases')
    }
  }

  useEffect(() => {
    if (submissionId === '' || !submissionId.includes('custom')) return

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

        const response = await axios.get(`http://localhost:8080/submissions/custom/${submissionId}`)

        if (response.status === 200 && response.data) {
          const payload = response.data

          if (payload.status === 'ACCEPTED') {
            toast.success(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (payload.status === 'WRONG_ANSWER') {
            toast.warning(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
          } else if (!['PROCESSING', 'IN_QUEUE'].includes(payload.status)) {
            if (['RUNTIME_ERROR_NZEC', 'INTERNAL_ERROR'].includes(payload.status)) {
              toast.error(`Unexpected error! ${payload.stderr ?? payload.error_message}`, { autoClose: false })
              clearInterval(pollInterval)
              setSubmissionId('')
              return
            }
            toast.error(`Error! ${payload.status}`, { autoClose: false })
          }

          if (!['PROCESSING', 'IN_QUEUE'].includes(payload.status)) {
            setExpectedResults(payload.expected_answer)
            setReceivedOutput(payload.user_answer)
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
    <Button
      disabled={Boolean(submissionId)}
      onClick={handleRunTestCases}
      icon={submissionId !== '' ?
        <CircularProgress size={20} style={{color: 'white'}}/>
        : <PlayArrow />
      }
      popup={isPreview ? 'Click to confirm correctness of provided test cases' : 'Click to run test case'}
    >
      Run Test Cases
    </Button>
  )
}
