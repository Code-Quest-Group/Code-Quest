import clsx from 'clsx'
import { Seperator } from '../../../utils'
import { useCodeEnvironment } from '../../../../providers'

type ProblemOptionsSelectorProps = {
    className?: string
    selectedClassName: string
    currentSelection: string
    // eslint-disable-next-line no-unused-vars
    handleSelection: (selected: string) => void
}

export const ProblemOptionsSelector = ({
  className,
  selectedClassName,
  currentSelection,
  handleSelection
}: ProblemOptionsSelectorProps) => {
  const { isPreview } = useCodeEnvironment()

  return (
    <div className={className}>
      <button
        className={clsx({[selectedClassName]: currentSelection === 'description'})}
        onClick={() => handleSelection('description')}
      >
            Description
      </button>
      <Seperator />
      <button
        className={clsx({[selectedClassName]: currentSelection === 'hints'})}
        onClick={() => handleSelection('hints')}
      >
            Hints
      </button>
      <Seperator />
      <button
        disabled={isPreview}
        className={clsx({[selectedClassName]: currentSelection === 'pseudoCode'})}
        onClick={() => handleSelection('pseudoCode')}
      >
        Comments
      </button>
      <Seperator />
      <button
        disabled={isPreview}
        className={clsx({[selectedClassName]: currentSelection === 'solutions'})}
        onClick={() => handleSelection('solutions')}>
            Solutions
      </button>
    </div>
  )
}
