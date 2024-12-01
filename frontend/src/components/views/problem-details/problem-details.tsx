import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { IconButton, Typography } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CodeEnvironmentProvider, useLayout, useUser } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import { Seperator } from '../../utils'
import { CodeEditor } from './code-editor'
import classes from './problem-details.module.scss'
import { SubmitButtonGroup } from './submit-group'
import { TestsSummary } from './tests-summary'
import { LeftSection } from './problem-details-left-section/problem-details-left-section'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { LanguageDropdown } from './language-selector'

type ProblemDetailsProps = {
  isPreview?: boolean
}

const ProblemDetails = ({ isPreview }: ProblemDetailsProps) => {
  const { problemId } = useParams<{ problemId: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { userProblem } = useUser()
  const { showNavbar } = useLayout()
  const fullScreenHandle = useFullScreenHandle()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPreview) {
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
    } else {
      setProblem(userProblem as Problem)
    }
  }, [problemId])

  if (error && !problem && !isPreview) {
    navigate('/not-found')
    return
  }

  if (!problem) {
    return (
      <div className='container'>
        <h1>You have no problem preview available</h1>
      </div>
    )
  }

  return (
    <CodeEnvironmentProvider problem={problem} isPreview={isPreview}>
      <main className={clsx(classes.problemDetailsContainer, {'full-height': !showNavbar})}>
        <LeftSection classes={classes} problem={problem}/>
        <Seperator />
        <div className={classes.rightSection}>
          <div className={classes.headerSection}>
            <span>Coding Workspace</span>
          </div>
          <div className={classes.mainCodingContainer}>
            <section className={classes.codingOptions}>
              <LanguageDropdown />
              <IconButton
                aria-label="fullscreen mode"
                onClick={fullScreenHandle.enter}
                disableRipple
              >
                <FullscreenIcon />
                <Typography style={{ marginLeft: '0.5rem', color: 'black' }}>Fullscreen Mode</Typography>
              </IconButton>
            </section>
            <FullScreen handle={fullScreenHandle}>
              <CodeEditor
                isFullscreen={fullScreenHandle.active}
                className={clsx({
                  [classes.fullscreenCodeEditor]: fullScreenHandle.active,
                })}
              />
            </FullScreen>
            <TestsSummary className={classes.testsSummary} />
            <Seperator isHorizontal />
            <SubmitButtonGroup className={classes.buttonGroup} />
          </div>
        </div>
      </main>
    </CodeEnvironmentProvider>
  )
}

export default ProblemDetails
