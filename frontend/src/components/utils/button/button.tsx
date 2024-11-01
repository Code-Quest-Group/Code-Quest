import { ButtonProps, Button as MuiButton } from '@mui/material'
import clsx from 'clsx'
import classes from './button.module.scss'

type CodeQuestButtonProps = ButtonProps & {
  seriousButton?: boolean
}

export const Button = ({ seriousButton, ...props }: CodeQuestButtonProps) => {
  return <MuiButton className={clsx(classes.customButton, {[classes.seriousButton]: seriousButton})} {...props} />
}
