import { useState } from 'react'
import { Typography, Box, Popover, TextField, IconButton} from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import { Button } from '../../../utils'

export const CommentButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<string>('')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmit = () => {
    setValue('')
    handleClose()
  }

  return (
    <>
      <Button
        aria-describedby='open-comment-problem-button'
        onClick={handleClick}
        icon={<CommentIcon />}
        popup={'Click to comment this problem'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
          Comment
        </Typography>
      </Button>

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
          alignItems: 'center',
          gap: 1,
          width: 300,
        }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <IconButton onClick={handleSubmit} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Popover>
    </>
  )
}
