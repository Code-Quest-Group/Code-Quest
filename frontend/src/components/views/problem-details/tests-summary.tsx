/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useCodeEnvironment } from '../../../providers'
import { parseRawResults } from './problem-details.utils'

type TestsSummaryProps = {
    className: string
}

export const TestsSummary = ({ className }: TestsSummaryProps) => {
  const {
    problem,
    currentTestIndex,
    setCurrentTestIndex,
    receivedOutput,
    testCases,
    inputFormat,
    expectedResults
  } = useCodeEnvironment()

  const [passingTests, setPassingTests] = useState<boolean[]>(
    Array(problem.exampleExpectedResults.length).fill(false)
  )
  const [formattedTests, setFormattedTests] = useState<any[]>(() =>
    parseRawResults(problem.exampleTestCases, inputFormat)
  )

  useEffect(() => {
    const updatedTests = parseRawResults(testCases, inputFormat)

    setFormattedTests(updatedTests)
  }, [testCases])

  useEffect(() => {
    if (!expectedResults || !receivedOutput) return

    const updatedFailingTests = expectedResults.map((expected, index) => {
      return receivedOutput[index] === expected
    })

    setPassingTests(updatedFailingTests)
  }, [expectedResults, receivedOutput])

  return (
    <div className={className} key={receivedOutput.join()}>
      <ul>
        {formattedTests.map((_testCase, index) => (
          <li key={index}>
            <Button onClick={() => setCurrentTestIndex(index + 1)}>
              <Typography
                variant="button"
                style={{
                  fontWeight: index + 1 === currentTestIndex ? 'bold' : 'normal',
                }}
              >
                <p>Test</p> Case {index + 1}:
              </Typography>
              {passingTests[index] ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Button>
          </li>
        ))}
      </ul>
      <div className="inside-shadow">
        <header>Test Case {currentTestIndex} Results:</header>
        <p>Input: {String(formattedTests[currentTestIndex - 1]).replace(/,/g, ', ')}</p>
        <p>
          Expected:{' '}
          {
            problem.exampleExpectedResults[currentTestIndex - 1] ||
            expectedResults[currentTestIndex - 1] ||
            'Not calculated yet'
          }
        </p>
        <p>Output: {String(receivedOutput[currentTestIndex - 1]).replace(/,/g, ', ') || 'None'}</p>
      </div>
    </div>
  )
}
