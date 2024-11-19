import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography} from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { Block, EditNote } from '@mui/icons-material'
import { Problem } from '../../../../types'

type ProblemListItemProps = {
    key: number,
    problem: Problem
}

export const ProblemListItem = ({ key, problem }: ProblemListItemProps) => {
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
        <ListItemText primary={problem.name} />
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
              {problem.name}
            </Typography>
          </div>
          <Seperator isHorizontal />
          <div className='container-column'>
            <Button
              icon={<EditNote />}
              sx={{ width: '10rem', marginTop: '1rem'}}
              popup='Click to edit problem'
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Update
              </Typography>
            </Button>
            <Button
              icon={<Block />}
              seriousButton
              sx={{ width: '10rem'}}
              popup='Click to permamently remove this problem'
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Remove
              </Typography>
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
