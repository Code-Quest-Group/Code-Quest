import { useState } from 'react'
import { Problem } from '../../../../types'
import { ProblemOptionsSelector } from './problem-options-selector'
import { ProblemDetailsDescription } from './problem-details-description'
import { useCodeEnvironment } from '../../../../providers'
import { CommentsSection } from './comments-section'
import { PublishedSubmissionsSection } from './published-submissions-sections'

type LeftSectionProps = {
    classes: CSSModuleClasses
    problem: Problem
}

export const LeftSection = ({ classes }: LeftSectionProps) => {
  const [selectedSection, setSelectedSection] = useState('description')

  return (
    <div className={classes.leftSection}>
      <ProblemOptionsSelector
        handleSelection={setSelectedSection}
        className={classes.headerSection}
        selectedClassName={classes.selected}
        currentSelection={selectedSection}
      />
      <div className={classes.problemInformationContainer}>
        <SectionHandler currentSection={selectedSection} classes={classes}/>
      </div>
    </div>
  )
}

type SectionHandlerProps = {
  currentSection: string
  classes: CSSModuleClasses
}

const SectionHandler = ({currentSection, classes}: SectionHandlerProps) => {
  const { problem } = useCodeEnvironment()

  if (currentSection === 'hints') {
    const hints = problem.hints

    return (
      <div className='scrollable'>
        <header className='header'> Hints </header>

        {hints && hints.length > 0 ? (
          <>
            {hints.map((hint, index) => (
              <div className={classes.whiteBackgroundDescription} key={index}>
                <p>{hint}</p>
              </div>
            ))}
          </>
        ) : (
          <p>This problem has no hints available at this time</p>
        )}
      </div>
    )
  }

  if (currentSection === 'pseudoCode') {
    // Despite being named pseudocode, this is the comment section
    return <CommentsSection commentClassName={classes.whiteBackgroundDescription}/>
  }

  if (currentSection === 'description') {
    return <ProblemDetailsDescription classes={classes} />
  }

  return <PublishedSubmissionsSection />
}
