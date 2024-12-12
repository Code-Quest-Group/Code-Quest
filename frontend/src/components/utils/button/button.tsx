
import MuiButton from '@mui/material/Button'
import { ButtonProps } from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import clsx from 'clsx'
import classes from './button.module.scss'
import { ReactNode } from 'react'

type CodeQuestButtonProps = ButtonProps & {
  children: ReactNode
  seriousButton?: boolean
  icon?: ReactNode
  popup?: string
  leftIcon?: boolean
  className?: string
  disabled?: boolean
  hidden?: boolean
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
  children,
  hidden,
  ...props
}: CodeQuestButtonProps) => {
  return (
    <Tooltip title={popup} arrow placement="top" disableFocusListener>
      <span style={{ display: hidden ? 'none' : 'inline-block' }}>
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

        >
          <Typography variant="button" style={{ textTransform: 'none' }}>
            {children}
          </Typography>
        </MuiButton>
      </span>
    </Tooltip>
  )
}
