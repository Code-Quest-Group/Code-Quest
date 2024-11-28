import { ButtonProps, Button as MuiButton, Tooltip } from '@mui/material'
import clsx from 'clsx'
import classes from './button.module.scss'
import { ReactNode } from 'react'

type CodeQuestButtonProps = ButtonProps & {
  seriousButton?: boolean
  icon?: ReactNode
  popup?: string
  leftIcon?: boolean
  className?: string
  disabled?: boolean
} & (
  | { leftIcon: true; icon: ReactNode }
  | { leftIcon?: never; icon?: ReactNode }
)

export const Button = ({
  seriousButton,
  icon,
  popup,
  leftIcon,
  className,
  disabled,
  ...props
}: CodeQuestButtonProps) => {
  return (
    <Tooltip title={popup} arrow placement="top" disableFocusListener>
      <span style={{ display: 'inline-block' }}>
        <MuiButton
          disabled={disabled}
          className={clsx(
            classes.customButton,
            {
              [classes.seriousButton]: seriousButton,
              [classes.hasIcon]: icon,
            },
            className
          )}
          startIcon={leftIcon ? icon : undefined}
          endIcon={leftIcon ? undefined : icon}
          {...props}
        />
      </span>
    </Tooltip>
  )
}
