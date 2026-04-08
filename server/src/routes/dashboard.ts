import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { findUserById } from '../data/users'
import { getEventById } from '../data/events'
import { getChallengeById } from '../data/challenges'

const router = Router()

// GET /api/dashboard — full dashboard payload for the logged-in user
router.get('/', authenticate, (req, res): void => {
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  const enrolledEvents = user.enrolledEvents
    .map((id) => getEventById(id))
    .filter(Boolean)

  const activeChallenges = user.activeChallenges
    .map((id) => {
      const ch = getChallengeById(id)
      if (!ch) return null
      // Mock per-user progress (in prod this would be a separate table)
      const progress = Math.floor(Math.random() * 70) + 10
      return { ...ch, progress }
    })
    .filter(Boolean)

  // Mock activity feed
  const activity = [
    { time: '2 HRS AGO', text: `Submitted solution for "${activeChallenges[0]?.title ?? 'challenge'}" — score 72/100`, accent: '#d3ef57' },
    { time: '1 DAY AGO', text: `Registered for ${enrolledEvents[1]?.title ?? 'an event'}`, accent: '#dbb8ff' },
    { time: '2 DAYS AGO', text: 'Earned badge: Hot Streak (7 consecutive days)', accent: '#74facb' },
    { time: '3 DAYS AGO', text: 'Completed "Graph Weaver" challenge — 950 XP awarded', accent: '#d3ef57' },
  ]

  // Next rank threshold
  const rankThresholds: Record<string, { next: string; threshold: number }> = {
    Member: { next: 'Senior', threshold: 5000 },
    Senior: { next: 'Expert', threshold: 8000 },
    Expert: { next: 'Elite', threshold: 12000 },
    Elite: { next: 'Architect', threshold: 15000 },
    Architect: { next: 'Legendary', threshold: 20000 },
    Legendary: { next: 'Legendary', threshold: 20000 },
  }
  const rankInfo = rankThresholds[user.badge] ?? { next: user.badge, threshold: user.xp }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      rank: user.rank,
      badge: user.badge,
      challenges: user.challenges,
      streak: user.streak,
      track: user.track,
    },
    rankProgress: {
      current: user.badge,
      next: rankInfo.next,
      xp: user.xp,
      threshold: rankInfo.threshold,
      percent: Math.min(Math.round((user.xp / rankInfo.threshold) * 100), 100),
    },
    enrolledEvents,
    activeChallenges,
    activity,
  })
})

export default router
