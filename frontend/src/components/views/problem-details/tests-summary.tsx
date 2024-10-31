/* eslint-disable no-unused-vars */
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useCodeEnvironment } from '../../../providers'

type TestsSummaryProps = {
    className: string
    formattedTests: unknown[][]
    formattedExpectedResults: unknown[][]
}

export const TestsSummary = ({
  className,
  formattedTests,
  formattedExpectedResults,
}: TestsSummaryProps) => {
  const { currentTestIndex, setCurrentTestIndex, failingTests, setFailingTests } = useCodeEnvironment()

  useEffect(() => {
    const failingTestsList = Array(formattedTests.length).fill(true)
    setFailingTests(failingTestsList)
  }, [])

  return (
    <div className={className}>
      <ul>
        {formattedTests.map((_testCase, index) => (
          <li key={index}>
            <Button onClick={() => setCurrentTestIndex(index + 1)}>
              <Typography variant="button" style={{ fontWeight: (index + 1 === currentTestIndex) ? 'bold' : 'normal' }}>
                Test Case {index + 1}:
              </Typography>
              {failingTests[index] ? <CancelIcon color='error' /> : <CheckCircleIcon color="success" />}
            </Button>
          </li>
        ))}
      </ul>
      <div className='inside-shadow'>
        <header>Test Case {currentTestIndex} Results:</header>
        <p>Input: <>[{formattedTests[currentTestIndex - 1][0]},{formattedTests[currentTestIndex - 1][1]}]</></p>
        <p>Expected: <>[{formattedExpectedResults[currentTestIndex - 1]}]</></p>
        <p>Output: [0]</p>
      </div>
    </div>
  )
}
