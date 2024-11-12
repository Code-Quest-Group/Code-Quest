import { useState } from "react"
import { Problem } from "../../../../types"
import { ProblemOptionsSelector } from "./problem-options-selector"
import { ProblemDetailsDescription } from "./problem-details-description"
import { useCodeEnvironment } from "../../../../providers"

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
        <ProblemDetailsDescription classes={classes} />
        </div>
    </div>
    )
}

const SectionHandler = (currentSection: string, classes: CSSModuleClasses) => {
    const { problem } = useCodeEnvironment()

    if (currentSection === 'description') {
        return <ProblemDetailsDescription classes={classes} />
    }

    if (currentSection === 'hints') {
        return (
            <div className={classes.whiteBackgroundDescription}>
                <p>{problem.hints || 'This problem has no hints available at this time'}</p>
            </div>
        )
    }

    if (currentSection === 'pseudoCode') {
        <div className={classes.whiteBackgroundDescription}>
            <p>{problem.pseudocode || "This problem has no pseudo code available at this time"}</p>
        </div>
    }

    if (currentSection === 'solutions') {
        {problem.userSolutions ? 
            (
                <>
                    {problem.userSolutions.map((solution, index) => (
                        <li key={index}>
                            <header>{solution.userName} | Completed in {solution.time}</header>
                            <div className={classes.whiteBackgroundDescription}>
                                <p></p>
                                {solution.code}
                            </div>
                        </li>
                    ))} 
                </>
            ) : (
                <>
                    tmp
                </>
            )
        }
    }

}