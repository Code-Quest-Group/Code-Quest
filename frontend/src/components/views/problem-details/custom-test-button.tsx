import { useState } from 'react'
import { Box, Popover, TextField, IconButton} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Button } from '../../utils'
import { toast } from 'react-toastify'
import { useCodeEnvironment } from '../../../providers'

export const CustomTestButton = () => {
  const { testCases, setTestCases, inputFormat, isPreview } = useCodeEnvironment()
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
        const format = formatParts[index]

        if (format === 'int') {
          return /^-?\d+$/.test(part)
        }

        if (format === 'string') {
          return typeof part === 'string'
        }

        if (format === 'list[int]') {
          return /^\[(-?\d+(,\s*-?\d+)*)?\]$/.test(part)
        }

        if (format === 'list[string]') {
          return /^\[".*?"(,\s*".*?")*\]$/.test(part)
        }

        return false
      })
    }

    if (!isValidFormat()) {
      toast.error('Invalid input format, make sure all data is followed with an EOL')
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
        disabled={isPreview}
        aria-describedby='open-custom-case-field'
        onClick={handleClick}
        icon={<EditNoteIcon />}
        popup={isPreview ? 'Cannot add a custom case to preview' : 'Click write a custom case'}
      >
        Custom Test Case
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
