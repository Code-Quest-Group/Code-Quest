import clsx from 'clsx'
import { useLayout } from '../../../providers'

const NotFoundPage = () => {
  const { showNavbar } = useLayout()

  return (
    <main className={clsx({'full-height': !showNavbar}, 'container')}>
      <h1>It seems that this page doesn&apos;t exist :(</h1>
    </main>
  )
}

export default NotFoundPage
