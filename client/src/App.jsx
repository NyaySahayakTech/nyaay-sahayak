import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Hum aage chalkar yahan /login, /analyze routes add karenge */}
    </Routes>
  )
}

export default App
