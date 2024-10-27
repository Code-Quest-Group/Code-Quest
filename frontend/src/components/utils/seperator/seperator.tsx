import clsx from 'clsx'
import classes from './seperator.module.scss'

type SeperatorProps = {
    isHorizontal?: boolean
    hasMargins?: boolean
}

export const Seperator = ({isHorizontal, hasMargins}: SeperatorProps) => {
  return <span className={clsx(classes.seperator,
    {[classes.horizontal]: isHorizontal, [classes.margin]: hasMargins}
  )}/>
}
