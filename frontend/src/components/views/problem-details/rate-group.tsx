import CommentIcon from '@mui/icons-material/Comment'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import { Typography } from '@mui/material'
import { Button } from '../../utils'

type RateButtonGroupProps = {
    className: string
}

export const RateButtonGroup = ({ className }: RateButtonGroupProps) => {

  return (
    <div className={className}>
      <Button onClick={() => window.alert('Not implemened 😇')}>
        <Typography variant="button" style={{ textTransform: 'none' }}>
           Rate
        </Typography>
        <ThumbsUpDownIcon />
      </Button>
      <Button onClick={() => window.alert('Not implemened 😇')}>
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Comment
        </Typography>
        <CommentIcon />
      </Button>
      <Button onClick={() => window.alert('Not implemened 😇')} seriousButton>
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Report
        </Typography>
        <ReportProblemIcon />
      </Button>
    </div>
  )
}
