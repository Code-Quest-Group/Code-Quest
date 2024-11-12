import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { IconButton, Typography } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CodeEnvironmentProvider, useLayout } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import { Seperator } from '../../utils'
import { CodeEditor } from './code-editor'
import classes from './problem-details.module.scss'
import { parseRawResults } from './problem-details.utils'
import { SubmitButtonGroup } from './submit-group'
import { TestsSummary } from './tests-summary'
import { LeftSection } from './problem-details-left-section/problem-details-left-section'

const ProblemDetails = () => {
  const { problemId } = useParams<{ problemId: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { showNavbar } = useLayout()

  useEffect(() => {
    const fetchProblem = async() => {
      setError(null)
      try {
        const fetchedProblem = await ProblemService.getProblem(problemId!)
        setProblem(fetchedProblem)
      } catch (error) {
        setError('Failed to fetch problem data ' + error)
      }
    }

    fetchProblem()
  }, [problemId])

  if (error) {
    return <h1>{error}</h1>
  }

  if (!problem) {
    return <h1>Problem Not Found</h1>
  }

  return (
    <CodeEnvironmentProvider problem={problem}>
      <main className={clsx(classes.problemDetailsContainer, {'full-height': !showNavbar})}>
        <LeftSection classes={classes} problem={problem}/>
        <Seperator />
        <div className={classes.rightSection}>
          <div className={classes.headerSection}>
            <span>Coding Workspace</span>
          </div>
          <div className={classes.mainCodingContainer}>
            <section className={classes.codingOptions}>
              <p>Language</p>
              <span>Python</span>
              <IconButton aria-label="fullscreen mode" disableRipple>
                <FullscreenIcon />
                <Typography style={{ marginLeft: '0.5rem' }}>Fullscreen Mode</Typography>
              </IconButton>
            </section>
            <CodeEditor />
            <TestsSummary
              formattedTests={parseRawResults(problem.testCases, problem.inputFormat)}
              formattedExpectedResults={parseRawResults(problem.expectedResult, 'int')}
              className={classes.testsSummary}
            />
            <Seperator isHorizontal />
            <SubmitButtonGroup className={classes.buttonGroup} />
          </div>
        </div>
      </main>
    </CodeEnvironmentProvider>
  )
}

export default ProblemDetails
