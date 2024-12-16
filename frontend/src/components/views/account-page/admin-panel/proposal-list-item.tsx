import { useState } from 'react'
import { Box, Popover, ListItem, ListItemText, Typography, CircularProgress} from '@mui/material'
import { Proposal } from '../../../../types/problem/proposal.type'
import { Button, Seperator } from '../../../utils'
import { Block, CheckBox } from '@mui/icons-material'
import axios from 'axios'
import { toast } from 'react-toastify'
import { config } from '../../../../../config'

type ProposalListItemProps = {
  problemProposal: Proposal
  onClose: () => void
}

export const ProposalListItem = ({ problemProposal, onClose }: ProposalListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleApprove = async () => {
    setLoading(true)
    try {
      await axios.patch(`${config.apiBaseUrl}/problems/proposals/${problemProposal.problem_id}/approve`)

      toast.success('Problem approved succesfully!')
    } catch (error) {
      console.error('Error approving proposal:', error)
      toast.error('Failed to approve the problem proposal.')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await axios.patch(`${config.apiBaseUrl}/problems/proposals/${problemProposal.problem_id}/reject`)

      toast.success('Problem rejected succesfully!')
    } catch (error) {
      console.error('Error rejecting proposal:', error)
      toast.error('Failed to reject the problem proposal.')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <>
      <ListItem component="button" onClick={handleClick}>
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

          <Seperator isHorizontal />

          <Typography variant="body2">
            <strong>Author:</strong> {problemProposal.author}
          </Typography>

          <Typography variant="body2">
            <strong>Description:</strong> {problemProposal.description}
          </Typography>

          <Typography variant="body2">
            <strong>Code Template:</strong> <pre>{problemProposal.code_template}</pre>
          </Typography>

          <Typography variant="body2">
            <strong>Constraints:</strong> {problemProposal.constraints}
          </Typography>

          <Typography variant="body2">
            <strong>Example Testcases:</strong> {problemProposal.example_testcases}
          </Typography>

          <Typography variant="body2">
            <strong>Example Expected Result:</strong> {JSON.stringify(problemProposal.example_expected_result)}
          </Typography>

          <Typography variant="body2">
            <strong>Hints:</strong> {problemProposal.hints ? problemProposal.hints.join(', ') : 'No hints available'}
          </Typography>

          <Typography variant="body2">
            <strong>Input Format:</strong> {problemProposal.input_format}
          </Typography>

          <Typography variant="body2">
            <strong>Tags:</strong> {problemProposal.tags.join(', ')}
          </Typography>

          <Seperator isHorizontal />

          <div className="container" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button
              popup="Click to approve problem proposal"
              onClick={handleApprove}
              disabled={loading}
              icon={loading ?
                <CircularProgress size={20} style={{ color: 'white' }} />
                : <CheckBox />
              }
            >
              Approve
            </Button>
            <Button
              seriousButton
              popup="Click to decline problem proposal"
              onClick={handleReject}
              disabled={loading}
              icon={loading ?
                <CircularProgress size={20} style={{ color: 'white' }} />
                : <Block />
              }
            >
              Reject
            </Button>
          </div>
        </Box>
      </Popover>
    </>
  )
}
