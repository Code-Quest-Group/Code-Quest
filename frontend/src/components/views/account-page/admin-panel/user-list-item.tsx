import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography} from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { User } from '../../../../types'

type UserListItemProps = {
    key: number,
    user: User
}

export const UserListItem = ({ key, user }: UserListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

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
        <ListItemText primary={user.username} />
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
              {user.username}
            </Typography>
          </div>
          <Seperator isHorizontal />
          <div className='container-column'>
            <Button
              sx={{ width: '22rem', marginTop: '1rem'}}
              popup='Click to give this user Admin privileges'
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Give Admin Permissions
              </Typography>
            </Button>
            <Button
              seriousButton
              sx={{ width: '22rem'}}
              popup='Click to ban this user'
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Ban User
              </Typography>
            </Button>
            <Button
              seriousButton
              sx={{ width: '22rem'}}
              popup='Click to permamently remove this user'
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Remove Permamently
              </Typography>
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
