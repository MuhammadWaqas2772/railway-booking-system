import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false) // close menu after logout
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          RailwayBooking
        </Link>

        {/* Hamburger Button for Mobile */}
        <div
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/search" onClick={() => setMenuOpen(false)}>Search Trains</Link>
          </li>
          {user && (
            <li>
              <Link to="/tickets" onClick={() => setMenuOpen(false)}>My Tickets</Link>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </li>
            </>
          ) : (
            <li className="nav-user">
              <span>Welcome, {user.name}</span>
              {user.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="btn btn-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
