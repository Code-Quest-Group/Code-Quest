import { useState } from 'react'
import { Typography, Box, Popover, TextField, IconButton} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Button } from '../../utils'
import { toast } from 'react-toastify'
import { useCodeEnvironment } from '../../../providers'

export const CustomTestButton = () => {
  const { testCases, setTestCases, inputFormat } = useCodeEnvironment()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<string>('')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmit = () => {
    const isValidFormat = () => {
      const formatParts = inputFormat.split(' ')
      const inputParts = value.trim().split('\n')

      if (inputParts.length !== formatParts.length) return false

      return inputParts.every((part, index) => {
        if (formatParts[index] === 'int') {
          return /^\d+$/.test(part)
        }
        return false
      })
    }

    if (!isValidFormat()) {
      toast.error('Invalid input format')
      return
    }

    toast.info('Added new custom test case')
    setTestCases(testCases.trimEnd() + '\n' + value)
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
          width: 200,
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
