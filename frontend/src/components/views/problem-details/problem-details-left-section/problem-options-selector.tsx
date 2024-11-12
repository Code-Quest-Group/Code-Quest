import clsx from 'clsx'
import { Seperator } from '../../../utils'

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
        className={clsx({[selectedClassName]: currentSelection === 'pseudocode'})}
        onClick={() => handleSelection('pseudocode')}
      >
            Pseudocode
      </button>
      <Seperator />
      <button
        className={clsx({[selectedClassName]: currentSelection === 'solutions'})}
        onClick={() => handleSelection('solutions')}>
            Solutions
      </button>
    </div>
  )
}
