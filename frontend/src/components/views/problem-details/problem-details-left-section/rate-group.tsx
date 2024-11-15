import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { Typography } from '@mui/material'
import { Button } from '../../../utils'
import { RatingButton } from './rate-problem-button'
import { CommentButton } from './comment-problem-button'

type RateButtonGroupProps = {
    className: string
}

export const RateButtonGroup = ({ className }: RateButtonGroupProps) => {

  return (
    <div className={className}>
      <RatingButton />
      <CommentButton />
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
