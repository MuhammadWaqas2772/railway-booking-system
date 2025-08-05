import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MyTickets = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchTickets()
  }, [user, navigate])

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/bookings/user')
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return
    }

    try {
      await axios.patch(`/api/bookings/${ticketId}/cancel`)
      fetchTickets() // Refresh the tickets list
    } catch (error) {
      console.error('Error cancelling ticket:', error)
      alert('Failed to cancel ticket. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading your tickets...</div>

  return (
    <div className="container">
      <h1 className="page-title">My Tickets</h1>
      
      {tickets.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No tickets found. <a href="/search">Book your first ticket</a>
          </p>
        </div>
      ) : (
        tickets.map(ticket => (
          <div key={ticket._id} className="ticket-card">
            <div className="ticket-header">
              <h3>Booking ID: {ticket._id.slice(-8).toUpperCase()}</h3>
              <span className={`ticket-status ${ticket.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}`}>
                {ticket.status.toUpperCase()}
              </span>
            </div>
            
            <div className="ticket-details">
              <div className="ticket-section">
  <h4>Train Details</h4>
  {ticket.train ? (
    <>
      <p><strong>Name:</strong> {ticket.train.name}</p>
      <p><strong>Number:</strong> {ticket.train.number}</p>
      <p><strong>Route:</strong> {ticket.train.source} → {ticket.train.destination}</p>
      <p><strong>Departure:</strong> {ticket.train.departureTime}</p>
      <p><strong>Arrival:</strong> {ticket.train.arrivalTime}</p>
    </>
  ) : (
    <p style={{ color: 'red' }}>Train details are not available. This train might have been removed.</p>
  )}
</div>

              
              <div className="ticket-section">
                <h4>Passengers ({ticket.passengers.length})</h4>
                {ticket.passengers.map((passenger, index) => (
                  <p key={index}>
                    {index + 1}. {passenger.name} ({passenger.age}yrs, {passenger.gender})
                  </p>
                ))}
              </div>
              
              <div className="ticket-section">
                <h4>Booking Info</h4>
                <p><strong>Booked on:</strong> {new Date(ticket.bookingDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> pkr{ticket.totalAmount}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
              </div>
            </div>
            
            {ticket.status === 'confirmed' && (
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button 
                  onClick={() => cancelTicket(ticket._id)}
                  className="btn btn-danger"
                >
                  Cancel Ticket
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default MyTickets