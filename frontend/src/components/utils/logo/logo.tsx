import { Box } from '@mui/material'
import logo from '../../../assets/logo.png'

export const CodeQuestLogo = () => {
  return (
    <Box
      component="img"
      src={logo}
      alt="CodeQuest Logo"
      sx={{ width: 'auto', height: 'auto', marginLeft: '0.5rem' }}
    />
  )
}
