import { Box } from '@mui/material'
import logo from '../../../assets/logo.svg'

export const CodeQuestLogo = () => {
  return (
    <Box
      component="img"
      src={logo}
      alt="CodeQuest Logo"
      sx={{
        width: 'auto',
        height: 'auto',
        marginLeft: '0.5rem',
        filter: `
          brightness(0)
          saturate(100%)
          invert(32%)
          sepia(87%)
          saturate(1214%)
          hue-rotate(188deg)
          brightness(92%) 
          contrast(93%)
          `
      }}
    />
  )
}
