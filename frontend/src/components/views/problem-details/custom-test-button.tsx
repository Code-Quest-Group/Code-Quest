import { useState } from 'react'
import { Typography, Box, Popover, TextField, IconButton} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Button } from '../../utils'
import { toast } from 'react-toastify'

export const CustomTestButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<string>('')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmit = () => {
    toast.info('Custom case submitted (thats a lie)')
    setValue('')
    handleClose()
  }

  return (
    <>
      <Button
        aria-describedby='open-custom-case-field'
        onClick={handleClick}
        icon={<EditNoteIcon />}
        popup={'Click write a custom case'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Custom Test Case
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
            minRows={1}
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <IconButton onClick={handleSubmit} color="primary">
            <PlayArrowIcon />
          </IconButton>
        </Box>
      </Popover>
    </>
  )
}
