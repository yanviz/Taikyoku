import { Router } from 'express'
import { authenticate, adminOnly } from '../middleware/auth'
import { users } from '../data/users'
import { events } from '../data/events'
import { challenges } from '../data/challenges'
import { projects } from '../data/projects'
import type { Event, Challenge } from '../types'

const router = Router()

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly)

// ── Stats ──────────────────────────────────────────────────────────────────

router.get('/stats', (_req, res) => {
  res.json({
    totalMembers: users.length,
    activeEvents: events.filter((e) => e.status !== 'Full').length,
    totalEvents: events.length,
    totalChallenges: challenges.length,
    totalProjects: projects.length,
    totalXpAwarded: users.reduce((sum, u) => sum + u.xp, 0),
  })
})

// ── Members ────────────────────────────────────────────────────────────────

router.get('/members', (_req, res) => {
  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      xp: u.xp,
      rank: u.rank,
      badge: u.badge,
      track: u.track,
      streak: u.streak,
      challenges: u.challenges,
      createdAt: u.createdAt,
    }))
  )
})

router.patch('/members/:id/role', (req, res): void => {
  const { role } = req.body as { role?: 'member' | 'admin' }
  const user = users.find((u) => u.id === req.params.id)
  if (!user) { res.status(404).json({ error: 'User not found' }); return }
  if (role !== 'member' && role !== 'admin') { res.status(400).json({ error: 'Role must be "member" or "admin"' }); return }
  user.role = role
  res.json({ id: user.id, role: user.role })
})

// ── Events CRUD ────────────────────────────────────────────────────────────

router.get('/events', (_req, res) => {
  res.json(events)
})

router.post('/events', (req, res): void => {
  const { type, date, title, description, slots, total, status, location, accent } =
    req.body as Partial<Event>

  if (!type || !date || !title || !description || slots == null || total == null) {
    res.status(400).json({ error: 'type, date, title, description, slots, total are required' })
    return
  }

  const newEvent: Event = {
    id: `ev${Date.now()}`,
    type,
    date,
    title,
    description,
    slots: Number(slots),
    total: Number(total),
    status: status ?? 'Open',
    location: location ?? 'TBD',
    accent: accent ?? '#d3ef57',
  }
  events.push(newEvent)
  res.status(201).json(newEvent)
})

router.patch('/events/:id', (req, res): void => {
  const event = events.find((e) => e.id === req.params.id)
  if (!event) { res.status(404).json({ error: 'Event not found' }); return }
  const fields = req.body as Partial<Event>
  Object.assign(event, fields)
  res.json(event)
})

router.delete('/events/:id', (req, res): void => {
  const idx = events.findIndex((e) => e.id === req.params.id)
  if (idx === -1) { res.status(404).json({ error: 'Event not found' }); return }
  events.splice(idx, 1)
  res.json({ message: 'Deleted' })
})

// ── Challenges CRUD ────────────────────────────────────────────────────────

router.get('/challenges', (_req, res) => {
  res.json(challenges)
})

router.post('/challenges', (req, res): void => {
  const { title, difficulty, xp, pool, tags, description } =
    req.body as Partial<Challenge>

  if (!title || !difficulty || xp == null || pool == null || !description) {
    res.status(400).json({ error: 'title, difficulty, xp, pool, description are required' })
    return
  }

  const newChallenge: Challenge = {
    id: `ch${Date.now()}`,
    title,
    difficulty: difficulty as Challenge['difficulty'],
    xp: Number(xp),
    pool: Number(pool),
    completions: 0,
    participants: 0,
    tags: tags ?? [],
    description,
  }
  challenges.push(newChallenge)
  res.status(201).json(newChallenge)
})

router.patch('/challenges/:id', (req, res): void => {
  const challenge = challenges.find((c) => c.id === req.params.id)
  if (!challenge) { res.status(404).json({ error: 'Challenge not found' }); return }
  const fields = req.body as Partial<Challenge>
  Object.assign(challenge, fields)
  res.json(challenge)
})

router.delete('/challenges/:id', (req, res): void => {
  const idx = challenges.findIndex((c) => c.id === req.params.id)
  if (idx === -1) { res.status(404).json({ error: 'Challenge not found' }); return }
  challenges.splice(idx, 1)
  res.json({ message: 'Deleted' })
})

export default router
