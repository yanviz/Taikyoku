import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Landing page after Google OAuth redirect.
// URL: /oauth-callback?token=<jwt>
const OAuthCallback = () => {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      navigate('/login?error=oauth_failed', { replace: true })
      return
    }

    loginWithToken(token)
    navigate('/dashboard', { replace: true })
  }, [navigate, loginWithToken])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="font-mono text-primary text-xs tracking-[0.3em] animate-pulse">
        AUTHENTICATING...
      </div>
    </div>
  )
}

export default OAuthCallback
