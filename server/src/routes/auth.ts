import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { findUserByEmail, createUser, findUserById } from '../data/users'
import { signToken, authenticate } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res): void => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const user = findUserByEmail(email)
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = bcrypt.compareSync(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role })

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      xp: user.xp,
      rank: user.rank,
      challenges: user.challenges,
      streak: user.streak,
      badge: user.badge,
      track: user.track,
    },
  })
})

// POST /api/auth/signup
router.post('/signup', (req, res): void => {
  const { email, name, password, track } = req.body as {
    email?: string
    name?: string
    password?: string
    track?: string
  }

  if (!email || !name || !password || !track) {
    res.status(400).json({ error: 'All fields are required' })
    return
  }

  const existing = findUserByEmail(email)
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' })
    return
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' })
    return
  }

  const user = createUser({ email, name, password, track })
  const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role })

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      xp: user.xp,
      rank: user.rank,
      challenges: user.challenges,
      streak: user.streak,
      badge: user.badge,
      track: user.track,
    },
  })
})

// GET /api/auth/me — returns current user profile (requires auth)
router.get('/me', authenticate, (req, res): void => {
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    xp: user.xp,
    rank: user.rank,
    challenges: user.challenges,
    streak: user.streak,
    badge: user.badge,
    track: user.track,
    enrolledEvents: user.enrolledEvents,
    activeChallenges: user.activeChallenges,
    createdAt: user.createdAt,
  })
})

export default router
