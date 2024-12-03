import { FC } from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

type SessionTimeoutModalProps = {
  open: boolean
  onClose?: () => void
}

const SessionTimeoutModal: FC<SessionTimeoutModalProps> = ({ open, onClose }) => {

  const handleLogoutAndRedirect = () => {
    if (onClose) onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="session-timeout-modal"
      aria-describedby="session-timeout-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="session-timeout-modal" variant="h6" component="h2">
          Session Timed Out
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleLogoutAndRedirect}>
            Okay
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SessionTimeoutModal
