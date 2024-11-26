import { Box, CircularProgress, Modal, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useCodeEnvironment, useUser } from '../../../providers'
import { SubmissionResponse } from '../../../types'
import { Button } from '../../utils'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { CustomTestButton } from './custom-test-button'
import { RunTestCasesButton } from './run-test-cases-button'
import { AddTask, DoNotDisturb } from '@mui/icons-material'

type SubmitButtonGroupProps = {
    className: string
}

export const SubmitButtonGroup = ({ className }: SubmitButtonGroupProps) => {
  const { code, problem, submissionId, setSubmissionId } = useCodeEnvironment()
  const { username } = useUser()
  const [openModal, setOpenModal] = useState(false)
  const [time, setTime] = useState(0)
  const [memory, setMemory] = useState(0)

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

  const handleCloseModal = () => {
    setOpenModal(false)
    setSubmissionId('')
  }

  const handlePublishSubmission = async() => {
    try {
      if (!submissionId) {
        toast.error('Submission ID is missing.')
        return
      }

      const response = await axios.put(`http://localhost:8080/submissions/${submissionId}/publish`)

      if (response.status === 200) {
        toast.success('Solution published successfully!')
        handleCloseModal()
      } else {
        toast.error('Failed to publish the solution.')
      }
    } catch (error) {
      console.error('Error publishing solution:', error)
      toast.error('An error occurred while publishing the solution.')
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
            setMemory(payload.time)
            setTime(payload.time)
            setOpenModal(true)
          } else if (payload.status === 'WRONG_ANSWER') {
            toast.warning(`Passed test cases ${payload.correct_testcases} / ${payload.total_testcases}`)
            toast.error(`Wrong asnwer! Failed at ${payload.error_message}`, { autoClose: false })
          } else if (payload.status === 'TIME_LIMIT_EXCEEDED') {
            toast.error(`Runtime error! Single test case took ${payload.time} seconds!`, { autoClose: false })
          } else if (payload.status !== 'PROCESSING') {
            toast.error(`Unexpected error! ${payload.error_message}`, { autoClose: false })
          }

          if (payload.status !== 'PROCESSING') {
            clearInterval(pollInterval)

            if (payload.status !== 'ACCEPTED') setSubmissionId('')
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
      <Modal open={openModal} onClose={handleCloseModal} >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 1,
          }}
        >
          <Typography variant="h5" component="h2">
            Submission Accepted
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Time: {time}s {' '} Memory: {memory}
          </Typography>
          <Typography sx={{ mt: 2, marginBottom: '2rem' }}>
            Do you wish to publish your solution?
          </Typography>
          <div className='container'>
            <Button icon={<AddTask />} onClick={handlePublishSubmission}>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                  Yes
              </Typography>
            </Button>
            <Button seriousButton icon={<DoNotDisturb />} onClick={handleCloseModal}>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                  No
              </Typography>
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
