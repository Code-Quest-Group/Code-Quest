import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { Typography } from '@mui/material'
import { Button } from '../../../utils'
import { RatingButton } from './rate-problem-button'
import { CommentButton } from './comment-problem-button'
import { toast } from 'react-toastify'

type RateButtonGroupProps = {
    className: string
}

export const RateButtonGroup = ({ className }: RateButtonGroupProps) => {

  return (
    <div className={className}>
      <RatingButton />
      <CommentButton />
      <Button
        onClick={() => toast.info('Reported the problem to administration!')}
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
