import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Navbar } from './components/utils/nav-bar'
import { HomePage } from './components/views/home-page'
import { ProblemDetails } from './components/views/problem-details'
import { ProblemList } from './components/views/problem-list'
import { LayoutProvider } from './providers/'

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:problemId" element={<ProblemDetails />} />
        </Routes>
      </Router>
    </LayoutProvider>
  )
}

export default App
