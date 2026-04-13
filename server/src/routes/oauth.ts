import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { eq } from 'drizzle-orm'
import { db, users } from '../db'
import { signToken } from '../middleware/auth'
import type { JwtPayload } from '../types'

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL ?? 'http://localhost:4000'}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) return done(new Error('No email from Google'))

        // Find or create user
        let [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))

        if (!user) {
          const [created] = await db.insert(users).values({
            id: `u${Date.now()}`,
            email: email.toLowerCase(),
            name: profile.displayName ?? email.split('@')[0],
            role: 'member',
            passwordHash: null,
            xp: 0,
            rank: 0,
            challenges: 0,
            streak: 0,
            badge: 'Member',
            track: 'Fullstack',
          }).returning()
          user = created
        }

        // Map DB user → JwtPayload shape (Express.User)
        const payload: JwtPayload = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'member' | 'admin',
        }
        done(null, payload)
      } catch (err) {
        done(err as Error)
      }
    }
  )
)

// Passport serialize/deserialize (minimal — we use JWTs, not sessions)
passport.serializeUser((user, done) => done(null, (user as JwtPayload).userId))
passport.deserializeUser((id, done) => done(null, { userId: id } as JwtPayload))

const router = Router()

// Step 1 — redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Step 2 — Google calls back here
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const user = req.user!
    const token = signToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    })
    res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}`)
  }
)

export default router
