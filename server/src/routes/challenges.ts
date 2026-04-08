import { Router } from 'express'
import { challenges, getChallengeById } from '../data/challenges'
import { authenticate } from '../middleware/auth'
import { findUserById } from '../data/users'

const router = Router()

// GET /api/challenges
router.get('/', (_req, res) => {
  res.json(challenges)
})

// GET /api/challenges/:id
router.get('/:id', (req, res): void => {
  const challenge = getChallengeById(req.params.id)
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' })
    return
  }
  res.json(challenge)
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

export default router
