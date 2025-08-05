import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SearchTrains = () => {
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  })

  const cities = [
    'Lahore', 'karachi', 'islamabad', 'rawalpindi', 'okara', 
    'sahiwal', 'gujjar khan', 'peshawar', 'pattoki'
  ]

  useEffect(() => {
    fetchAllTrains()
  }, [])

  const fetchAllTrains = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/trains')
      setTrains(response.data)
    } catch (error) {
      console.error('Error fetching trains:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const params = new URLSearchParams()
      if (searchParams.source) params.append('source', searchParams.source)
      if (searchParams.destination) params.append('destination', searchParams.destination)
      
      const response = await axios.get(`/api/trains/search?${params}`)
      setTrains(response.data)
    } catch (error) {
      console.error('Error searching trains:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container">
      <h1 className="page-title">Search Trains</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <div className="form-group">
            <label className="form-label">From</label>
            <select
              name="source"
              value={searchParams.source}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Source</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">To</label>
            <select
              name="destination"
              value={searchParams.destination}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Destination</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Trains'}
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading trains...</div>
      ) : (
        <div className="trains-grid">
          {trains.length === 0 ? (
            <div className="card">
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                No trains found. Try different search criteria.
              </p>
            </div>
          ) : (
            trains.map(train => (
              <div key={train._id} className="train-card">
                <div className="train-info">
                  <h3>{train.name} ({train.number})</h3>
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
                      <strong>Available Seats</strong>
                      <span>{train.availableSeats}</span>
                    </div>
                    <div className="train-detail">
                      <strong>Price</strong>
                      <span>pkr{train.price}</span>
                    </div>
                  </div>
                </div>
                <div className="train-actions">
                  <Link 
                    to={`/book/${train._id}`} 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    Book Now
                  </Link>
                  <span className="btn btn-outline">
                  pkr{train.price}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchTrains