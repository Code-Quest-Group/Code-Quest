import clsx from 'clsx'
import { useLayout } from '../../../providers'
import { CircularProgress } from '@mui/material'

export const LoadingPage = () => {
  const { showNavbar } = useLayout()

  return (
    <main className={clsx({'full-height': !showNavbar}, 'container')}>
      <CircularProgress />
    </main>
  )
}
