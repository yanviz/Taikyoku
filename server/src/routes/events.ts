import { Router } from 'express'
import { events, getEventById } from '../data/events'
import { authenticate, optionalAuth } from '../middleware/auth'
import { findUserById } from '../data/users'

const router = Router()

// GET /api/events
router.get('/', (_req, res) => {
  res.json(events)
})

// GET /api/events/:id — enriched with enrolledByMe when authenticated
router.get('/:id', optionalAuth, (req, res): void => {
  const event = getEventById(req.params.id)
  if (!event) {
    res.status(404).json({ error: 'Event not found' })
    return
  }

  let enrolledByMe = false
  if (req.user) {
    const user = findUserById(req.user.userId)
    if (user) enrolledByMe = user.enrolledEvents.includes(event.id)
  }

  res.json({ ...event, enrolledByMe })
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
  user.enrolledEvents.push(event.id)
  event.slots -= 1
  user.xp += 50

  res.json({ message: 'RSVP confirmed', eventId: event.id })
})

// DELETE /api/events/:id/rsvp — cancel RSVP
router.delete('/:id/rsvp', authenticate, (req, res): void => {
  const event = getEventById(req.params.id)
  if (!event) {
    res.status(404).json({ error: 'Event not found' })
    return
  }
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  const idx = user.enrolledEvents.indexOf(event.id)
  if (idx === -1) {
    res.status(409).json({ error: 'Not enrolled' })
    return
  }
  user.enrolledEvents.splice(idx, 1)
  event.slots += 1

  res.json({ message: 'RSVP cancelled', eventId: event.id })
})

export default router
