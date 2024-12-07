import { Box, CircularProgress, Button as MuiButton, Popover, Switch, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { UserService } from '../../../services/user-service'
import { useUser } from '../../../providers'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import { Button } from '../../utils'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

type Preferences = {
  language: string,
  timezone: string,
  darkMode: boolean,
  isProfilePublic: boolean
}

type SettingsButtonProps = {
  hideButton?: boolean
  preferences?: Preferences
}

const SettingsButton = ({ hideButton, preferences }: SettingsButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [isProfilePublic, setIsProfilePublic] = useState(preferences?.isProfilePublic ?? false)
  const [isDarkMode, setIsDarkMode] = useState(preferences?.darkMode ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const { userId, setDarkMode } = useUser()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const confirmChange = async() => {
    setIsLoading(true)
    try {
      await UserService.setUserPreferences(userId, {
        language: 'en',
        timezone: 'UTC',
        dark_mode: isDarkMode,
        is_profile_public: isProfilePublic,
      })

      setDarkMode(isDarkMode)
      handleClose()
      toast.success('Updated preferences!')
    } catch (error) {
      toast.error('Failed to update preferences: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <MuiButton
        className={clsx({['hidden']: hideButton})}
        aria-describedby='open-settings-button'
        onClick={handleClick}
      >
        <Typography variant="button" style={{ textTransform: 'none', color: '#125497' }}>
          Settings
        </Typography>
      </MuiButton>

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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          width: 200,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Typography>Public profile</Typography>
            <Switch
              checked={isProfilePublic}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setIsProfilePublic(event.target.checked)
              }
            />
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            width: '100%'
          }}>
            <Typography>Dark Mode</Typography>
            <Switch
              checked={isDarkMode}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setIsDarkMode(event.target.checked)
              }
            />
          </Box>
          <Button
            onClick={confirmChange}
            disabled={isLoading}
            icon={isLoading ?
              <CircularProgress size={20} style={{color: 'white'}}/>
              : <CheckCircleIcon />
            }
          >
            Confirm
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default SettingsButton
