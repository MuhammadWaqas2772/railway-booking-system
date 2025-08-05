import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SearchTrains from './pages/SearchTrains'
import BookTicket from './pages/BookTicket'
import MyTickets from './pages/MyTickets'
import Login from './pages/Login'
import Register from './pages/Register'

import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchTrains />} />
            <Route path="/book/:trainId" element={<BookTicket />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App