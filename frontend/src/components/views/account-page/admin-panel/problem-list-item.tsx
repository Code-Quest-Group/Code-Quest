import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography} from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { EditNote, OpenInBrowser } from '@mui/icons-material'
import { Problem } from '../../../../types'
import { useNavigate } from 'react-router-dom'

type ProblemListItemProps = {
    problem: Problem
}

export const ProblemListItem = ({ problem }: ProblemListItemProps) => {
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
              popup='Click to edit problem templates'
            >
              Update
            </Button>
            <Button
              icon={<OpenInBrowser />}
              sx={{ width: '10rem'}}
              popup='Click to open problem page'
              onClick={() => navigate(`/problems/${problem.problemId}`)}
            >
              Open
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
