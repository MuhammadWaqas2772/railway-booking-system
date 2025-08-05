import express from 'express'
import Booking from '../models/Booking.js'
import Train from '../models/Train.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Create new booking
router.post('/', authenticate, async (req, res) => {
  try {
    const { trainId, passengers, totalAmount } = req.body

    // Check if train exists and has available seats
    const train = await Train.findById(trainId)
    if (!train) {
      return res.status(404).json({ message: 'Train not found' })
    }

    if (train.availableSeats < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' })
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      train: trainId,
      passengers,
      totalAmount
    })

    await booking.save()

    // Update available seats
    train.availableSeats -= passengers.length
    await train.save()

    res.status(201).json({ message: 'Booking confirmed successfully', booking })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get user's bookings
router.get('/user', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('train')
      .sort({ createdAt: -1 })
    
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all bookings (Admin only)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('train')
      .sort({ createdAt: -1 })
    
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Cancel booking
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('train')
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' })
    }

    // Update booking status
    booking.status = 'cancelled'
    await booking.save()

    // Return seats to train
    const train = await Train.findById(booking.train._id)
    if (train) {
      train.availableSeats += booking.passengers.length
      await train.save()
    }

    res.json({ message: 'Booking cancelled successfully', booking })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single booking
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('train')
      .populate('user', 'name email phone')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' })
    }

    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router