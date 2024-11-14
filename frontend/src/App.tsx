import React, { Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navbar } from './components/utils/nav-bar'
import { LayoutProvider } from './providers/'
import { UserProvider } from './providers/user-provider/user-provider'

const ProblemList = React.lazy(() => import('./components/views/problem-list/problem-list'))
const ProblemDetails = React.lazy(() => import('./components/views/problem-details/problem-details'))

function App() {
  return (
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
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<ProblemList />} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/problems/:problemId" element={<ProblemDetails />} />
            </Routes>
          </Suspense>
        </Router>
      </UserProvider>
    </LayoutProvider>
  )
}

export default App
