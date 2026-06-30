import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import History from './pages/History'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  )
}

export default App
