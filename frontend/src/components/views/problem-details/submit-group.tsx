import { Typography } from '@mui/material'
import axios from 'axios'
import { useCodeEnvironment } from '../../../providers'
import { Button } from '../../utils'

type SubmitButtonGroupProps = {
    className: string
}

export const SubmitButtonGroup = ({ className }: SubmitButtonGroupProps) => {
  const { code, problem } = useCodeEnvironment()

  const handleSubmit = async() => {
    try {
      const response = await axios.post('http://localhost:8080/submissions/', {
        sourceCode: code,
        problemId: problem?.problemId,
        language: 'PYTHON',
      })

      if (response.status === 200) {
        console.log('Submission successful')
      } else {
        console.error('Failed to submit')
      }
    } catch (error) {
      console.error('Error submitting:', error)
    }
  }

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
      <Button onClick={handleSubmit}>
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Submit
        </Typography>
      </Button>
    </div>
  )
}
