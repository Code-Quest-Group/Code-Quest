import { Box, Button, Popover, Switch, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import clsx from 'clsx'

type SettingsButtonProps = {
  hideButton?: boolean
}

export const SettingsButton = ({ hideButton }: SettingsButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [checked, setChecked] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const handleChange = async() => {
  //   // add reques tto update...
  // }

  return (
    <>
      <Button
        className={clsx({['hidden']: hideButton})}
        aria-describedby='open-settings-button'
        onClick={handleClick}
      >
        <Typography variant="button" style={{ textTransform: 'none', color: '#125497' }}>
            Settings
        </Typography>
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          width: 200,
        }}>
          <Typography>Private profile</Typography>
          <Switch
            checked={checked}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)}
          />
        </Box>
      </Popover>
    </>
  )
}
