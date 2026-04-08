import { Router } from 'express'
import { projects } from '../data/projects'

const router = Router()

// GET /api/projects
router.get('/', (_req, res) => {
  res.json(projects)
})

export default router
