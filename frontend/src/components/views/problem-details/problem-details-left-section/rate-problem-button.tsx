import { useState } from 'react'
import { Typography, Box, Popover, Rating } from '@mui/material'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import { Button } from '../../../utils'

export const RatingButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<number | null>(2)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        aria-describedby='open-rate-problem-button'
        onClick={handleClick}
        icon={<ThumbsUpDownIcon />}
        popup={'Click to rate this problem'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
          Rate
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
        <Box sx={{ padding: '1rem' }}>
          <Rating name="rate-problem"
            value={value}
            onChange={(_event, newValue) => {
              setValue(newValue) // gonna later send request
            }}/>
        </Box>
      </Popover>
    </>
  )
}
