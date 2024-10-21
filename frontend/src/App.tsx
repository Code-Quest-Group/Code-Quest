import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Navbar } from './components/utils/nav-bar/navbar'
import { HomePage } from './components/views/home-page/home-page'
import { ProblemDetails } from './components/views/problem-details'
import { ProblemList } from './components/views/problem-list/problem-list'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:problemId" element={<ProblemDetails />} />
      </Routes>
    </Router>
  )
}

export default App
