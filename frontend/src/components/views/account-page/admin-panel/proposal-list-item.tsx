import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography} from '@mui/material'
import { Proposal } from '../../../../types/problem/proposal.type'
import { Button, Seperator } from '../../../utils'
import { Block, CheckBox } from '@mui/icons-material'

type ProposalListItemProps = {
    key: number,
    problemProposal: Proposal
}

export const ProposalListItem = ({ key, problemProposal }: ProposalListItemProps) => {
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
        <ListItemText primary={problemProposal.name} />
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
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {problemProposal.name}
          </Typography>
          <Typography variant="body2">
            <strong>Author:</strong> {problemProposal.author}
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong> {problemProposal.description}
          </Typography>
          <Typography variant="body2">
            <strong>Code Template:</strong> {problemProposal.codeTemplate}
          </Typography>
          <Typography variant="body2">
            <strong>Correct Solution:</strong> {problemProposal.correctSolution}
          </Typography>
          <Typography variant="body2">
            <strong>Constraints:</strong> {problemProposal.constraints}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
            <strong>Example:</strong> {problemProposal.example}
          </Typography>
          <Seperator isHorizontal />
          <div className='container'>
            <Button icon={<CheckBox />} popup='Click to approve problem proposal'>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Approve
              </Typography>
            </Button>
            <Button icon={<Block />} seriousButton popup='Click to decline problem proposal'>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Reject
              </Typography>
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
