import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { Typography } from '@mui/material'
import { Button } from '../../../utils'
import { RatingButton } from './rate-problem-button'
import { CommentButton } from './comment-problem-button'
import { toast } from 'react-toastify'
import { useCodeEnvironment } from '../../../../providers'

type RateButtonGroupProps = {
    className: string
}

export const RateButtonGroup = ({ className }: RateButtonGroupProps) => {
  const { isPreview } = useCodeEnvironment()

  return (
    <div className={className}>
      <RatingButton />
      <CommentButton />
      <Button
        disabled={isPreview}
        onClick={() => toast.info('Reported the problem to administration!')}
        seriousButton
        icon={<ReportProblemIcon />}
        popup={isPreview ? 'Cannot report preview' : 'Click to report this problem'}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
            Report
        </Typography>
      </Button>
    </div>
  )
}
