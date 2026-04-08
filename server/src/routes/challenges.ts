import { Router } from 'express'
import { challenges, getChallengeById } from '../data/challenges'
import { authenticate, optionalAuth } from '../middleware/auth'
import { findUserById } from '../data/users'

const router = Router()

// GET /api/challenges
router.get('/', (_req, res) => {
  res.json(challenges)
})

// GET /api/challenges/:id — enriched with enrolledByMe when authenticated
router.get('/:id', optionalAuth, (req, res): void => {
  const challenge = getChallengeById(req.params.id)
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' })
    return
  }

  let enrolledByMe = false
  if (req.user) {
    const user = findUserById(req.user.userId)
    if (user) enrolledByMe = user.activeChallenges.includes(challenge.id)
  }

  res.json({ ...challenge, enrolledByMe })
})

// POST /api/challenges/:id/enroll — requires auth
router.post('/:id/enroll', authenticate, (req, res): void => {
  const challenge = getChallengeById(req.params.id)
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' })
    return
  }
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (user.activeChallenges.includes(challenge.id)) {
    res.status(409).json({ error: 'Already enrolled in this challenge' })
    return
  }
  user.activeChallenges.push(challenge.id)
  challenge.participants += 1

  res.json({ message: 'Enrolled', challengeId: challenge.id })
})

// DELETE /api/challenges/:id/enroll — withdraw from challenge
router.delete('/:id/enroll', authenticate, (req, res): void => {
  const challenge = getChallengeById(req.params.id)
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' })
    return
  }
  const user = findUserById(req.user!.userId)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  const idx = user.activeChallenges.indexOf(challenge.id)
  if (idx === -1) {
    res.status(409).json({ error: 'Not enrolled' })
    return
  }
  user.activeChallenges.splice(idx, 1)
  challenge.participants = Math.max(0, challenge.participants - 1)

  res.json({ message: 'Withdrawn', challengeId: challenge.id })
})

export default router
