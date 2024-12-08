import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { IconButton, Typography } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CodeEnvironmentProvider, useUser } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import { FallbackComponent, Seperator } from '../../utils'
import { CodeEditor } from './code-editor'
import classes from './problem-details.module.scss'
import { SubmitButtonGroup } from './submit-group'
import { TestsSummary } from './tests-summary'
import { LeftSection } from './problem-details-left-section/problem-details-left-section'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { LanguageDropdown } from './language-selector'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingPage } from '../loading-page/loading-page'

type ProblemDetailsProps = {
  isPreview?: boolean
}

const ProblemDetails = ({ isPreview }: ProblemDetailsProps) => {
  const { problemId } = useParams<{ problemId: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsloading] = useState<boolean>(false)
  const [isSafari, setIsSafari] = useState<boolean>(false)
  const { userProblem } = useUser()
  const fullScreenHandle = useFullScreenHandle()

  useEffect(() => {
    const isUsingSafari = navigator.userAgent.toLowerCase().includes('safari')
    setIsSafari(isUsingSafari)
  }, [])

  useEffect(() => {
    setIsloading(true)
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
      setIsloading(false)
    } else {
      setProblem(userProblem as Problem)
    }
  }, [problemId])

  if (error && !problem && !isPreview && !isLoading) {
    return (
      <div className='container scrollable'>
        <h1>No problem with given name found</h1>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className={clsx(classes.problemDetailsContainer)}>
        <LoadingPage />
      </div>
    )
  }

  return (
    <CodeEnvironmentProvider problem={problem} isPreview={isPreview}>
      <main className={clsx(classes.problemDetailsContainer, {[classes.safariInsanity]: isSafari})}>
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
                disableTouchRipple
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
            <ErrorBoundary FallbackComponent={FallbackComponent}>
              <TestsSummary className={classes.testsSummary} />
            </ErrorBoundary>
            <Seperator isHorizontal />
            <SubmitButtonGroup className={classes.buttonGroup} />
          </div>
        </div>
      </main>
    </CodeEnvironmentProvider>
  )
}

export default ProblemDetails
