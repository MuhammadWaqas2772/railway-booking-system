import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const BookTicket = () => {
  const { trainId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [train, setTrain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'male', seatPreference: 'window' }
  ])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchTrain()
  }, [trainId, user, navigate])

  const fetchTrain = async () => {
    try {
      const response = await axios.get(`/api/trains/${trainId}`)
      setTrain(response.data)
    } catch (error) {
      console.error('Error fetching train:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: 'male', seatPreference: 'window' }])
  }

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index))
    }
  }

  const updatePassenger = (index, field, value) => {
    const updated = passengers.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    )
    setPassengers(updated)
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setBooking(true)

    try {
      const bookingData = {
        trainId: train._id,
        passengers: passengers,
        totalAmount: train.price * passengers.length
      }

      await axios.post('/api/bookings', bookingData)
      navigate('/tickets')
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <div className="loading">Loading train details...</div>
  if (!train) return <div className="error">Train not found</div>

  const totalAmount = train.price * passengers.length

  return (
    <div className="container">
      <h1 className="page-title">Book Ticket</h1>
      
      <div className="card">
        <h2>{train.name} ({train.number})</h2>
        <div className="train-details">
          <div className="train-detail">
            <strong>Route</strong>
            <span>{train.source} → {train.destination}</span>
          </div>
          <div className="train-detail">
            <strong>Departure</strong>
            <span>{train.departureTime}</span>
          </div>
          <div className="train-detail">
            <strong>Arrival</strong>
            <span>{train.arrivalTime}</span>
          </div>
          <div className="train-detail">
            <strong>Price per seat</strong>
            <span>pkr{train.price}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleBooking} className="card">
        <h3>Passenger Details</h3>
        
        {passengers.map((passenger, index) => (
          <div key={index} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Passenger {index + 1}</h4>
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem' }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  value={passenger.age}
                  onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                  className="form-input"
                  min="1"
                  max="120"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Seat Preference</label>
                <select
                  value={passenger.seatPreference}
                  onChange={(e) => updatePassenger(index, 'seatPreference', e.target.value)}
                  className="form-select"
                >
                  <option value="window">Window</option>
                  <option value="aisle">Aisle</option>
                  <option value="middle">Middle</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button type="button" onClick={addPassenger} className="btn btn-secondary">
          Add Passenger
        </button>
        
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3>Booking Summary</h3>
          <p><strong>Train:</strong> {train.name} ({train.number})</p>
          <p><strong>Route:</strong> {train.source} → {train.destination}</p>
          <p><strong>Passengers:</strong> {passengers.length}</p>
          <p><strong>Total Amount:</strong> pkr{totalAmount}</p>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={booking}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {booking ? 'Booking...' : `Book Tickets - pkr${totalAmount}`}
        </button>
      </form>
    </div>
  )
}

export default BookTicket