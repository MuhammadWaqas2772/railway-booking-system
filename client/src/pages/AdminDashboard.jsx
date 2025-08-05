import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('trains')
  const [trains, setTrains] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [trainForm, setTrainForm] = useState({
    name: '',
    number: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: '',
    price: ''
  })

  const cities = [
    'Lahore', 'karachi', 'islamabad', 'rawalpindi', 'okara', 
    'sahiwal', 'gujjar khan', 'peshawar', 'pattoki'
  ]

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login')
      return
    }
    fetchTrains()
    fetchBookings()
  }, [user, navigate])

  const fetchTrains = async () => {
    try {
      const response = await axios.get('/api/trains')
      setTrains(response.data)
    } catch (error) {
      console.error('Error fetching trains:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/all')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleTrainSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/trains', {
        ...trainForm,
        totalSeats: parseInt(trainForm.totalSeats),
        availableSeats: parseInt(trainForm.totalSeats),
        price: parseFloat(trainForm.price)
      })
      
      setTrainForm({
        name: '',
        number: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        totalSeats: '',
        price: ''
      })
      
      fetchTrains()
      alert('Train added successfully!')
    } catch (error) {
      console.error('Error adding train:', error)
      alert('Failed to add train')
    } finally {
      setLoading(false)
    }
  }

  const deleteTrain = async (trainId) => {
    if (!window.confirm('Are you sure you want to delete this train?')) {
      return
    }

    try {
      await axios.delete(`/api/trains/${trainId}`)
      fetchTrains()
    } catch (error) {
      console.error('Error deleting train:', error)
      alert('Failed to delete train')
    }
  }

  const handleInputChange = (e) => {
    setTrainForm({
      ...trainForm,
      [e.target.name]: e.target.value
    })
  }

  if (!user || !user.isAdmin) {
    return <div className="loading">Access denied</div>
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'trains' ? 'active' : ''}`}
          onClick={() => setActiveTab('trains')}
        >
          Manage Trains
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          View Bookings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'trains' && (
          <>
            <h2>Add New Train</h2>
            <form onSubmit={handleTrainSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Train Name</label>
                <input
                  type="text"
                  name="name"
                  value={trainForm.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Train Number</label>
                <input
                  type="text"
                  name="number"
                  value={trainForm.number}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Source</label>
                <select
                  name="source"
                  value={trainForm.source}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Source</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Destination</label>
                <select
                  name="destination"
                  value={trainForm.destination}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Destination</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Departure Time</label>
                <input
                  type="time"
                  name="departureTime"
                  value={trainForm.departureTime}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Arrival Time</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={trainForm.arrivalTime}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Total Seats</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={trainForm.totalSeats}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Price(pkr)</label>
                <input
                  type="number"
                  name="price"
                  value={trainForm.price}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </form>
            
            <button 
              type="submit" 
              onClick={handleTrainSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Train'}
            </button>

            <h2 style={{ marginTop: '3rem' }}>Existing Trains</h2>
            <table className="trains-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Route</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map(train => (
                  <tr key={train._id}>
                    <td>{train.name}</td>
                    <td>{train.number}</td>
                    <td>{train.source} → {train.destination}</td>
                    <td>{train.departureTime} - {train.arrivalTime}</td>
                    <td>{train.availableSeats}/{train.totalSeats}</td>
                    <td>pkr{train.price}</td>
                    <td>
                      <button 
                        onClick={() => deleteTrain(train._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            <h2>All Bookings</h2>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Train</th>
                  <th>Passengers</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking._id.slice(-8).toUpperCase()}</td>
                    <td>{booking.user.name}</td>
                    <td>{booking.train.name} ({booking.train.number})</td>
                    <td>{booking.passengers.length}</td>
                    <td>pkr{booking.totalAmount}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`ticket-status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard