/* eslint-disable no-unused-vars */
import {
  Box,
  CircularProgress,
  MenuItem,
  Button as MuiButton,
  Popover,
  Select,
  SelectChangeEvent,
  Switch,
  Typography
} from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { UserService } from '../../../services/user-service'
import { useUser } from '../../../providers'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import { Button } from '../../utils'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

type Preferences = {
  language: string
  timezone: string
  darkMode: boolean
  isProfilePublic: boolean
}

type SettingsButtonProps = {
  hideButton?: boolean
  preferences?: Preferences
  onClose: (value: Preferences) => void
}

const SettingsButton = ({ hideButton, preferences, onClose }: SettingsButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [isProfilePublic, setIsProfilePublic] = useState(preferences?.isProfilePublic ?? false)
  const [isDarkMode, setIsDarkMode] = useState(preferences?.darkMode ?? false)
  const [timezone, setTimezone] = useState(preferences?.timezone ?? 'UTC')
  const [isLoading, setIsLoading] = useState(false)
  const { userId, setDarkMode } = useUser()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleTimezoneChange = (event: SelectChangeEvent<string>) => {
    setTimezone(event.target.value)
  }

  const confirmChange = async () => {
    setIsLoading(true)
    try {
      const newPreferences = {
        language: 'en',
        timezone,
        dark_mode: isDarkMode,
        is_profile_public: isProfilePublic,
      }

      await UserService.setUserPreferences(userId, newPreferences)

      setDarkMode(isDarkMode)
      onClose({
        language: 'en',
        timezone,
        darkMode: isDarkMode,
        isProfilePublic,
      })
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
        className={clsx({ ['hidden']: hideButton })}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography>Public profile</Typography>
            <Switch
              inputProps={{ 'aria-label': 'Public Profile Setting' }}
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
              inputProps={{ 'aria-label': 'Dark Mode Setting' }}
              checked={isDarkMode}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setIsDarkMode(event.target.checked)
              }
            />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginBottom: '1rem',
          }}>
            <Typography>Time Zone</Typography>
            <Select
              inputProps={{ 'aria-label': 'Time Zone Setting' }}
              value={timezone}
              onChange={handleTimezoneChange}
              fullWidth
              sx={{ fontSize: '1rem' }}
            >
              {['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
                'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
                'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
                'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00',
                'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00']
                .map(zone => (
                  <MenuItem key={zone} value={zone} sx={{ fontSize: '1rem' }}>
                    {zone}
                  </MenuItem>
                ))
              }
            </Select>
          </Box>
          <Button
            onClick={confirmChange}
            disabled={isLoading}
            icon={isLoading ?
              <CircularProgress size={20} style={{ color: 'white' }} />
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
