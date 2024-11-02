/* eslint-disable no-unused-vars */
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button, Typography } from '@mui/material'
import deepEqual from 'fast-deep-equal'
import { useEffect } from 'react'
import { useCodeEnvironment } from '../../../providers'

type TestsSummaryProps = {
    className: string
    formattedTests: (number | string)[][]
    formattedExpectedResults: (number | string)[][]
}

export const TestsSummary = ({
  className,
  formattedTests,
  formattedExpectedResults,
}: TestsSummaryProps) => {
  const { currentTestIndex, setCurrentTestIndex, failingTests, setFailingTests, receivedOutput } = useCodeEnvironment()

  useEffect(() => {
    const failingTestsList = (receivedOutput.length === 0)
      ? Array(formattedTests.length).fill(true)
      : formattedTests.map((_, i) => !deepEqual(receivedOutput[i], formattedExpectedResults[i]))

    setFailingTests(failingTestsList)

  }, [receivedOutput])

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
        <p>Input: {`${formattedTests[currentTestIndex - 1]}`}</p>
        <p>Expected: {`${formattedExpectedResults[currentTestIndex - 1]}`}</p>
        <p>Output: {`${receivedOutput[currentTestIndex - 1] ?? 'None'}`}</p>
      </div>
    </div>
  )
}
