import express from 'express'
import Train from '../models/Train.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all trains
router.get('/', async (req, res) => {
  try {
    const trains = await Train.find().sort({ createdAt: -1 })
    res.json(trains)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Search trains
router.get('/search', async (req, res) => {
  try {
    const { source, destination } = req.query
    const query = {}
    
    if (source) query.source = { $regex: source, $options: 'i' }
    if (destination) query.destination = { $regex: destination, $options: 'i' }
    
    const trains = await Train.find(query).sort({ departureTime: 1 })
    res.json(trains)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get single train
router.get('/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id)
    if (!train) {
      return res.status(404).json({ message: 'Train not found' })
    }
    res.json(train)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add new train (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      number,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      availableSeats,
      price
    } = req.body

    // Check if train number already exists
    const existingTrain = await Train.findOne({ number })
    if (existingTrain) {
      return res.status(400).json({ message: 'Train with this number already exists' })
    }

    const train = new Train({
      name,
      number,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      availableSeats: availableSeats || totalSeats,
      price
    })

    await train.save()
    res.status(201).json({ message: 'Train added successfully', train })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update train (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const train = await Train.findById(req.params.id)
    if (!train) {
      return res.status(404).json({ message: 'Train not found' })
    }

    Object.assign(train, req.body)
    await train.save()

    res.json({ message: 'Train updated successfully', train })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete train (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const train = await Train.findById(req.params.id)
    if (!train) {
      return res.status(404).json({ message: 'Train not found' })
    }

    await Train.findByIdAndDelete(req.params.id)
    res.json({ message: 'Train deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router