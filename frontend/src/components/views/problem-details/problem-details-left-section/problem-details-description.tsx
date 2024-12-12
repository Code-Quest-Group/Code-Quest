import { useCodeEnvironment } from '../../../../providers'
import { TagsList } from '../../../utils/tags-list/tags-list'
import { parseRawResults } from '../problem-details.utils'
import { RateButtonGroup } from './rate-group'

type ProblemDetailsDescriptionProps = {
    classes: CSSModuleClasses
}

export const ProblemDetailsDescription = ({ classes }: ProblemDetailsDescriptionProps) => {
  const { problem, inputFormat } = useCodeEnvironment()

  const exampleFirstLine = parseRawResults(problem.exampleTestCases, inputFormat)[0]
  const example = `Input: ${exampleFirstLine} ->  Output: ${problem.exampleExpectedResults[0]}`

  return (
    <>
      <section>
        <header>{problem.name}</header>
        <p>{problem.rating ?? 5} / 5</p>
      </section>

      <TagsList tags={problem.tags ?? ['Linked Lists', 'Binary Search', 'Recursion']} />
      <div className={classes.infoContainer}>
        <div className={classes.whiteBackgroundDescription}>
          <p>{problem.description}</p>
        </div>
        <div>
          <header>Example</header>
          <div className={classes.whiteBackgroundDescription}>
            <p>{example}</p>
          </div>
        </div>
        <div>
          <header>Constraints</header>
          <div className={classes.whiteBackgroundDescription}>
            <p>{problem.constraints || 'Please add constraints'}</p>
          </div>
        </div>
      </div>

      <RateButtonGroup className={classes.buttonGroup} />
    </>
  )
}
