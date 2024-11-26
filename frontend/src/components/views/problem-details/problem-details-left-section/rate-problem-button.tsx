import { SyntheticEvent, useState } from 'react'
import { Typography, Box, Popover, Rating } from '@mui/material'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import { Button } from '../../../utils'
import axios from 'axios'
import { useCodeEnvironment, useUser } from '../../../../providers'
import { toast } from 'react-toastify'

export const RatingButton = () => {
  const { username } = useUser()
  const { problem } = useCodeEnvironment()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [value, setValue] = useState<number | null>(2)

  const handleRatingChange = async(_event: SyntheticEvent<Element, Event>, newValue: number | null) => {
    if (!username) {
      toast.warning('Please sign in to rate a problem')
      return
    }

    setValue(newValue)

    if (newValue !== null) {
      try {
        await axios.post(`http://localhost:8080/problems/${problem.problemId}/ratings`, {
          rating: newValue,
        })

        toast.success('Rating updated!')
      } catch (error) {
        console.error('Error updating rating:', error)
      }
    }
  }

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
            onChange={handleRatingChange}
          />
        </Box>
      </Popover>
    </>
  )
}
