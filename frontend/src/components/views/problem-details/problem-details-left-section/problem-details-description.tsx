import { useCodeEnvironment } from '../../../../providers'
import { TagsList } from '../../../utils/tags-list/tags-list'
import { RateButtonGroup } from './rate-group'

type ProblemDetailsDescriptionProps = {
    classes: CSSModuleClasses
}

export const ProblemDetailsDescription = ({ classes }: ProblemDetailsDescriptionProps) => {
  const { problem } = useCodeEnvironment()

  return (
    <>
      <section>
        <header>{problem.name}</header>
        <p>{problem.rating ?? 5} / 5</p>
      </section>

      <TagsList tags={['hard', 'easy', 'numbers']} />
      <div className={classes.whiteBackgroundDescription}>
        <p>{problem.description}</p>
      </div>
      <header>Example</header>
      <div className={classes.whiteBackgroundDescription}>
        <p>{problem.example}</p>
      </div>
      <header>Constraints</header>
      <div className={classes.whiteBackgroundDescription}>
        <p>{problem.constraints}</p>
      </div>

      <RateButtonGroup className={classes.buttonGroup} />
    </>
  )
}
