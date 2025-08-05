import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Train from './models/Train.js'
import dotenv from 'dotenv'

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/railway-booking')
    
    // Clear existing data
    await User.deleteMany({})
    await Train.deleteMany({})
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = new User({
      name: 'Admin User',
      email: 'admin-demo@railway.com',
      phone: '9876543210',
      password: adminPassword,
      isAdmin: true
    })
    await admin.save()
    
    // Create sample trains
    const trains = [
      {
        name: 'Rajdhani Express',
        number: '12001',
        source: 'Mumbai',
        destination: 'Delhi',
        departureTime: '16:35',
        arrivalTime: '08:10',
        totalSeats: 100,
        availableSeats: 100,
        price: 2500
      },
      {
        name: 'Shatabdi Express',
        number: '12002',
        source: 'Delhi',
        destination: 'Mumbai',
        departureTime: '17:15',
        arrivalTime: '09:45',
        totalSeats: 80,
        availableSeats: 80,
        price: 2200
      },
      {
        name: 'Duronto Express',
        number: '12003',
        source: 'Bangalore',
        destination: 'Chennai',
        departureTime: '06:00',
        arrivalTime: '12:30',
        totalSeats: 120,
        availableSeats: 120,
        price: 800
      },
      {
        name: 'Garib Rath',
        number: '12004',
        source: 'Chennai',
        destination: 'Bangalore',
        departureTime: '22:30',
        arrivalTime: '05:15',
        totalSeats: 150,
        availableSeats: 150,
        price: 600
      },
      {
        name: 'Jan Shatabdi',
        number: '12005',
        source: 'Kolkata',
        destination: 'Hyderabad',
        departureTime: '14:20',
        arrivalTime: '11:45',
        totalSeats: 90,
        availableSeats: 90,
        price: 1800
      }
    ]
    
    await Train.insertMany(trains)
    
    console.log('Seed data inserted successfully!')
    console.log('Admin credentials:')
    console.log('Email: admin-demo@railway.com')
    console.log('Password: admin123')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()