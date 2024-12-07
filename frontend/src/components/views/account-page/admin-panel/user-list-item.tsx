import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography} from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { useNavigate } from 'react-router-dom'

export type BasicUserData = {
  userId: string
  username: string
  lastLogin: string
}

type UserListItemProps = {
    key: number,
    user: BasicUserData
}

export const UserListItem = ({ key, user }: UserListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <ListItem
        key={key}
        component="button"
        onClick={handleClick}
      >
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
        <Box sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: 300,
        }}>
          <div className='container'>
            <Typography variant="h5" style={{ textTransform: 'none' }}>
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </Typography>
          </div>
          <Seperator isHorizontal />
          <div className='container-column'>
            <Button
              onClick={() => navigate(`/account/${user.userId}`)}
              sx={{ width: '22rem', marginTop: '0.5rem' }}
              popup='Click to open user page'
            >
              {`Open user's page`}
            </Button>
            <Button
              seriousButton
              sx={{ width: '22rem'}}
              popup='Click to permamently remove this user'
            >
              Remove Permamently
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
