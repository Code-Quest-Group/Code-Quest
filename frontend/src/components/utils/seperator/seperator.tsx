import clsx from 'clsx'
import classes from './seperator.module.scss'

type SeperatorProps = {
    isHorizontal?: boolean
    hasMargins?: boolean
    className?: string
}

export const Seperator = ({ isHorizontal, hasMargins, className }: SeperatorProps) => {
  return <span className={clsx(
    classes.seperator,
    {[classes.horizontal]: isHorizontal, [classes.margin]: hasMargins},
    className
  )}
  />
}
