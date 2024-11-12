import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ModelInfo from './pages/ModelInfo'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model-info" element={<ModelInfo />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App