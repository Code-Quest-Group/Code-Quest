import { useState } from 'react'
import { Box, Popover, TextField, IconButton} from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import { Button } from '../../../utils'
import { useCodeEnvironment, useUser } from '../../../../providers'
import { toast } from 'react-toastify'
import axios from 'axios'

export const CommentButton = () => {
  const { username } = useUser()
  const { problem, isPreview } = useCodeEnvironment()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<string>('')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmit = async() => {
    if (!username) {
      toast.warning('Please sign in to comment a problem')
      return
    }

    if (value !== null) {
      try {
        await axios.post(`http://localhost:8080/problems/${problem.problemId}/comments`, {
          content: value,
        })

        toast.success('Comment updated!')
      } catch (error) {
        console.error('Error updating comment:', error)
      }
    }
    setValue('')
    handleClose()
  }

  return (
    <>
      <Button
        disabled={isPreview}
        aria-describedby='open-comment-problem-button'
        onClick={handleClick}
        icon={<CommentIcon />}
        popup={isPreview ? 'Cannot comment preview' : 'Click to comment this problem'}
      >
        Comment
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
