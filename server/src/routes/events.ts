import { Router } from 'express'
import { events, getEventById } from '../data/events'
import { authenticate } from '../middleware/auth'
import { findUserById } from '../data/users'

const router = Router()

// GET /api/events
router.get('/', (_req, res) => {
  res.json(events)
})

// GET /api/events/:id
router.get('/:id', (req, res): void => {
  const event = getEventById(req.params.id)
  if (!event) {
    res.status(404).json({ error: 'Event not found' })
    return
  }
  res.json(event)
})

// POST /api/events/:id/rsvp — requires auth
router.post('/:id/rsvp', authenticate, (req, res): void => {
  const event = getEventById(req.params.id)
  if (!event) {
    res.status(404).json({ error: 'Event not found' })
    return
  }
  if (event.slots === 0) {
    res.status(409).json({ error: 'No slots available' })
    return
  }
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (user.enrolledEvents.includes(event.id)) {
    res.status(409).json({ error: 'Already enrolled' })
    return
  }
  // Mutate in-memory
  user.enrolledEvents.push(event.id)
  event.slots -= 1

  res.json({ message: 'RSVP confirmed', eventId: event.id })
})

export default router
