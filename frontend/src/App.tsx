import React, { Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navbar } from './components/utils/nav-bar'
import { LayoutProvider } from './providers/'
import { UserProvider } from './providers/user-provider/user-provider'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import NotFoundPage from './components/views/not-found-page/not-found-page'
import { LoadingPage } from './components/views/loading-page/loading-page'
import { WebApplication } from 'schema-dts'

const ProblemList = React.lazy(() => import('./components/views/problem-list/problem-list'))
const ProblemDetails = React.lazy(() => import('./components/views/problem-details/problem-details'))
const AccountPage = React.lazy(() => import('./components/views/account-page/account-page'))
const ProblemCreator = React.lazy(() => import('./components/views/problem-creator/problem-creator'))

const WebApplicationSchema = () => {
  const schema: WebApplication = {
    '@type': 'WebApplication',
    'name': 'Online Code Editor',
    'description': 'A powerful webapp allowing for learning through solving problems',
    'url': 'https://code-quest-pro.com',
    'operatingSystem': 'Web',
    'applicationCategory': 'Programming',
    'softwareVersion': '1.0',
    'mainEntityOfPage': 'https://code-quest-pro.com',
    'isAccessibleForFree': true
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

function App() {
  return (
    <HelmetProvider>
      <LayoutProvider>
        <UserProvider >
          <Router>
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
            />
            <Navbar />
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Browse a list of problems on Code Quest" />
                      </Helmet>
                      <ProblemList />
                    </>
                  }
                />
                <Route
                  path="/problems"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Browse a list of problems on Code Quest" />
                      </Helmet>
                      <ProblemList />
                    </>
                  }
                />
                <Route
                  path="/problems/:problemId"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Detailed view of a specific problem on Code Quest" />
                      </Helmet>
                      <ProblemDetails />
                    </>
                  }
                />
                <Route
                  path="/account/:userId"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Users account page" />
                      </Helmet>
                      <AccountPage />
                    </>
                  }
                />
                <Route
                  path="/problem-creator"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Create your own problem" />
                      </Helmet>
                      <ProblemCreator />
                    </>
                  }
                />
                <Route
                  path="/problem-creator/preview"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Preview your problem" />
                      </Helmet>
                      <ProblemDetails isPreview/>
                    </>
                  }
                />
                <Route
                  path="*"
                  element={
                    <>
                      <WebApplicationSchema />
                      <Helmet>
                        <link rel="preload" href="/fonts/Fredoka-Regular.ttf" as="font" type="font/ttf" />
                        <link rel="preload" href="/fonts/Fredoka-Bold.ttf" as="font" type="font/ttf" />
                        <meta name="description" content="Page not found" />
                      </Helmet>
                      <NotFoundPage />
                    </>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </UserProvider>
      </LayoutProvider>
    </HelmetProvider>
  )
}

export default App
