import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container">
      <section className="hero">
        <h1>Welcome to Railway Booking</h1>
        <p>Book your train tickets easily and manage your journeys</p>
        <Link to="/search" className="btn btn-primary">
          Search Trains
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Easy Search</h3>
          <p>Find trains by source and destination with real-time availability</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎫</div>
          <h3>Quick Booking</h3>
          <p>Book tickets in just a few clicks with secure payment</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Manage Tickets</h3>
          <p>View, modify or cancel your bookings anytime</p>
        </div>
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol style={{ padding: '1rem 2rem', lineHeight: '2' }}>
          <li>Create an account or login</li>
          <li>Search for trains by entering source and destination</li>
          <li>Select your preferred train and timing</li>
          <li>Fill in passenger details and book tickets</li>
          <li>Manage your bookings in the "My Tickets" section</li>
        </ol>
      </section>
    </div>
  )
}

export default Home