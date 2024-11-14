import CommentIcon from '@mui/icons-material/Comment'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import { Typography } from '@mui/material'
import { Button } from '../../../utils'

type RateButtonGroupProps = {
    className: string
}

export const RateButtonGroup = ({ className }: RateButtonGroupProps) => {

  return (
    <div className={className}>
      <Button
        onClick={() => window.alert('Not implemened 😇')}
        icon={<ThumbsUpDownIcon />}
        popup={'Click to rate this problem'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
           Rate
        </Typography>
      </Button>
      <Button
        onClick={() => window.alert('Not implemened 😇')}
        icon={<CommentIcon />}
        popup={'Click to leave a comment'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Comment
        </Typography>
      </Button>
      <Button
        onClick={() => window.alert('Not implemened 😇')}
        seriousButton
        icon={<ReportProblemIcon />}
        popup={'Click to report this problem'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Report
        </Typography>
      </Button>
    </div>
  )
}
