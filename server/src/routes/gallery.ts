import { Router } from 'express'
import { gallery } from '../data/gallery'

const router = Router()

// GET /api/gallery
router.get('/', (_req, res) => {
  res.json(gallery)
})

export default router
