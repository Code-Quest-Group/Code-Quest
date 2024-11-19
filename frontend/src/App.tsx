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

const ProblemList = React.lazy(() => import('./components/views/problem-list/problem-list'))
const ProblemDetails = React.lazy(() => import('./components/views/problem-details/problem-details'))
const AccountPage = React.lazy(() => import('./components/views/account-page/account-page'))

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
                      <Helmet>
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
                      <Helmet>
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
                      <Helmet>
                        <meta name="description" content="Detailed view of a specific problem on Code Quest" />
                      </Helmet>
                      <ProblemDetails />
                    </>
                  }
                />
                <Route
                  path="/account/:username"
                  element={
                    <>
                      <Helmet>
                        <meta name="description" content="Users account page" />
                      </Helmet>
                      <AccountPage />
                    </>
                  }
                />
                <Route
                  path="*"
                  element={
                    <>
                      <Helmet>
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
