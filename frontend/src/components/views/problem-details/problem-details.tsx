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
import { parseTestCases } from './problem-details.utils'
import { ProblemOptionsSelector } from './problem-options-selector'
import { RateButtonGroup } from './rate-group'
import { SubmitButtonGroup } from './submit-group'
import { TestsSummary } from './tests-summary'

export const ProblemDetails = () => {
  const { problemId } = useParams<{ problemId: string }>()
  const [selectedSection, setSelectedSection] = useState('description')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showNavbar } = useLayout()

  useEffect(() => {
    const fetchProblem = async() => {
      setLoading(true)
      setError(null)
      try {
        const fetchedProblem = await ProblemService.getProblem(problemId!)
        setProblem(fetchedProblem)
      } catch (error) {
        setError('Failed to fetch problem data ' + error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  if (!problem) {
    return <h1>Problem Not Found</h1>
  }

  return (
    <CodeEnvironmentProvider problem={problem}>
      <main className={clsx(classes.problemDetailsContainer, {'full-height': !showNavbar})}>
        <div className={classes.leftSection}>
          <ProblemOptionsSelector
            handleSelection={setSelectedSection}
            className={classes.headerSection}
            selectedClassName={classes.selected}
            currentSelection={selectedSection}
          />
          <div className={classes.problemInformationContainer}>
            <section>
              <header>{problem.name}</header>
              <p> 3.5 / 5 ⭐</p>
            </section>
            <section>
              <span>HARD</span>
              <span>EASY</span>
              <span>MEDIUM</span>
            </section>
            <div className={classes.whiteBackgroundDescription}>
              <p>{problem.description}</p>
            </div>
            <header>Example</header>
            <div className={classes.whiteBackgroundDescription}>
              <p>TBD: Lorem ipsum...</p>
            </div>
            <header>Constraints</header>
            <div className={classes.whiteBackgroundDescription}>
              <p>TBD: Lorem ipsum..</p>
            </div>
            <RateButtonGroup className={classes.buttonGroup} />
          </div>
        </div>
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
            <Seperator isHorizontal />
            <CodeEditor />
            <Seperator isHorizontal />
            <TestsSummary
              formattedTests={parseTestCases(problem.testCases, problem.inputFormat)}
              formattedExpectedResults={parseTestCases(problem.expectedResult, 'int')}
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
