import { useEffect, useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography } from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../../../../services/user-service'
import { toast } from 'react-toastify'

export type BasicUserData = {
  userId: string
  username: string
  lastLogin: string
  banned: boolean
}

type UserListItemProps = {
  user: BasicUserData
  onClose: () => void
}

export const UserListItem = ({ user, onClose }: UserListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [userData, setUserData] = useState<BasicUserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)

  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!anchorEl) return

      setError(null)

      try {
        const data = await UserService.getUserData(user.userId)

        setUserData({
          userId: data.userId,
          username: data.username,
          banned: Boolean(data.banned),
          lastLogin: data.lastLogin,
        })
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.')
        console.error('Error fetching user data:', err)
      }
    }

    fetchUserData()
  }, [anchorEl, user.userId])

  const handleBanToggle = async () => {
    if (!userData) return

    setLoadingAction(true)
    try {
      if (userData.banned) {
        await UserService.unbanUser(userData.userId)
        toast.info('Unbanned user ' + userData.username)
        setUserData((prev) => prev && { ...prev, banned: false })
      } else {
        await UserService.banUser(userData.userId)
        setUserData((prev) => prev && { ...prev, banned: true })
        toast.info('Banned user ' + userData.username)
      }
    } catch (err) {
      console.error('Error performing ban/unban action:', err)
      toast.error('Couldn\'t update this user status!')
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <>
      <ListItem component="button" onClick={handleClick}>
        <ListItemText primary={user.username.charAt(0).toUpperCase() + user.username.slice(1)} />
      </ListItem>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: 300,
          }}
        >
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : userData ? (
            <>
              <div className="container">
                <Typography variant="h5" style={{ textTransform: 'none' }}>
                  {userData.username.charAt(0).toUpperCase() + userData.username.slice(1)}
                </Typography>
              </div>
              <Seperator isHorizontal />
              <div className="container-column">
                <Button
                  onClick={() => {
                    navigate(`/account/${user.userId}`)
                    onClose()
                  }}
                  sx={{ width: '22rem', marginTop: '0.5rem' }}
                  popup="Click to open user page"
                >
                  {`Open user's page`}
                </Button>
                <Button
                  onClick={handleBanToggle}
                  disabled={loadingAction}
                  seriousButton={!userData.banned}
                  sx={{ width: '22rem' }}
                  popup={userData.banned ? 'Click to unban this user' : 'Click to ban this user'}
                >
                  {userData.banned ? 'Pardon user' : 'Ban User'}
                </Button>
              </div>
            </>
          ) : (
            <Typography>No user data available.</Typography>
          )}
        </Box>
      </Popover>
    </>
  )
}
