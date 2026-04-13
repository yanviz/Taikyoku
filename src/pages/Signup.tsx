import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { backendURL } from '../lib/api'

const tracks = [
  { id: 'Frontend', label: 'Frontend', icon: 'web' },
  { id: 'Backend', label: 'Backend', icon: 'dns' },
  { id: 'ML', label: 'ML / AI', icon: 'psychology' },
  { id: 'Security', label: 'Security', icon: 'shield' },
  { id: 'Fullstack', label: 'Fullstack', icon: 'hub' },
]

interface PasswordCheck {
  label: string
  pass: boolean
}

function getPasswordChecks(pw: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters', pass: pw.length >= 8 },
    { label: 'Uppercase letter (A–Z)', pass: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter (a–z)', pass: /[a-z]/.test(pw) },
    { label: 'Number (0–9)', pass: /[0-9]/.test(pw) },
    { label: 'Special character (!@#$…)', pass: /[^A-Za-z0-9]/.test(pw) },
  ]
}

function getStrength(checks: PasswordCheck[]): { score: number; label: string; color: string } {
  const score = checks.filter(c => c.pass).length
  if (score <= 1) return { score, label: 'VERY WEAK', color: '#ef4444' }
  if (score === 2) return { score, label: 'WEAK', color: '#f97316' }
  if (score === 3) return { score, label: 'FAIR', color: '#eab308' }
  if (score === 4) return { score, label: 'STRONG', color: '#84cc16' }
  return { score, label: 'VERY STRONG', color: '#d3ef57' }
}

const Signup = () => {
  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedTrack, setSelectedTrack] = useState('')
  const [error, setError] = useState('')
  const [showChecks, setShowChecks] = useState(false)

  const checks = useMemo(() => getPasswordChecks(password), [password])
  const strength = useMemo(() => getStrength(checks), [checks])
  const allChecksPassed = checks.every(c => c.pass)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')

    if (!allChecksPassed) {
      setError('Password does not meet all requirements.')
      setShowChecks(true)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!selectedTrack) {
      setError('Select a primary discipline.')
      return
    }

    try {
      await signup({ email, name, password, track: selectedTrack })
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#d3ef57 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -right-1/4 w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[50%] h-[50%] bg-primary/8 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 w-full max-w-xl px-6">
        <div className="kinetic-glass technical-border rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="scanline" />

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-surface-variant border border-outline-variant mb-6 group hover:border-primary transition-all duration-500">
              <span className="material-symbols-outlined text-primary text-4xl">deployed_code</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl tracking-[0.2em] text-on-surface uppercase italic">
              ESTABLISH CREDENTIALS
            </h1>
            <p className="font-mono text-primary text-[10px] mt-2 tracking-[0.3em] uppercase opacity-80">
              New Operator Registration // CODE DYNAMOS
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-error/10 border border-error/30 text-error text-xs font-mono rounded-sm relative z-10">
              {error}
            </div>
          )}

          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="name">
                Operator Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">person</span>
                </div>
                <input
                  className="w-full bg-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-0 rounded-sm py-4 pl-14 pr-4 text-on-surface font-body placeholder-on-surface-variant/30 transition-all text-sm"
                  id="name"
                  name="name"
                  placeholder="FULL_NAME"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="email">
                User Identifier
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">alternate_email</span>
                </div>
                <input
                  className="w-full bg-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-0 rounded-sm py-4 pl-14 pr-4 text-on-surface font-body placeholder-on-surface-variant/30 transition-all text-sm"
                  id="email"
                  name="email"
                  placeholder="ENGINEER_ID@CODEDYNAMOS.IO"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="password">
                Cipher Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">key</span>
                </div>
                <input
                  className="w-full bg-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-0 rounded-sm py-4 pl-14 pr-4 text-on-surface font-body placeholder-on-surface-variant/30 transition-all text-sm"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowChecks(true) }}
                  onFocus={() => setShowChecks(true)}
                  required
                />
              </div>

              {/* Strength meter */}
              {showChecks && password.length > 0 && (
                <div className="space-y-2 pt-1">
                  {/* Bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: strength.color }}>
                      STRENGTH: {strength.label}
                    </span>
                  </div>

                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                    {checks.map((c) => (
                      <div key={c.label} className="flex items-center gap-1.5">
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ color: c.pass ? '#d3ef57' : 'rgba(255,255,255,0.25)', fontSize: '13px' }}
                        >
                          {c.pass ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span
                          className="font-mono text-[9px] tracking-wide"
                          style={{ color: c.pass ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}
                        >
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="confirm">
                Confirm Cipher Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">lock</span>
                </div>
                <input
                  className={`w-full bg-surface-variant/50 border focus:ring-0 rounded-sm py-4 pl-14 pr-4 text-on-surface font-body placeholder-on-surface-variant/30 transition-all text-sm ${
                    confirm.length > 0
                      ? confirm === password
                        ? 'border-[#84cc16]'
                        : 'border-error/60'
                      : 'border-outline-variant focus:border-primary'
                  }`}
                  id="confirm"
                  name="confirm"
                  placeholder="••••••••"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                {confirm.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ color: confirm === password ? '#84cc16' : '#ef4444', fontSize: '16px' }}
                    >
                      {confirm === password ? 'check_circle' : 'cancel'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Track Selection */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                Primary Discipline
              </label>
              <div className="grid grid-cols-5 gap-2">
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-sm border text-[9px] font-mono font-bold uppercase tracking-wider transition-all ${
                      selectedTrack === t.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline-variant bg-surface-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-primary hover:bg-white text-on-primary font-headline font-extrabold py-4 rounded-sm flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] group tracking-[0.15em] text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'DEPLOYING...' : 'DEPLOY PROFILE'}</span>
              {!isLoading && (
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">rocket_launch</span>
              )}
            </button>
          </form>

          {/* Google OAuth */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-surface-container-lowest px-4 text-on-surface-variant font-mono tracking-[0.2em]">
                Or continue with
              </span>
            </div>
          </div>
          <a
            href={`${backendURL}/api/auth/google`}
            className="flex items-center justify-center gap-3 w-full bg-surface-variant border border-outline-variant hover:border-primary/50 py-3 rounded-sm transition-all duration-200 group relative z-10"
          >
            <img
              alt="Google"
              className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnbNwy7JyqJn0T1_m7VUuxtMwFFY4HUDUiWLRa-r2LzwpYvIqONPpE8-koSicUwFNYs4uNsbfp8CAs4_ZTm-EhjoI9Zovmy7xxyIpmYz9m45veLM04E763GSzSfXllH95Q7qI1Zav-fOs58BWQxzsNlcw4veYLabRdC-ZII5NiWU5ICwsB0NmXFODgYSUXJ123OUAP-T3Heo_V0ILhd-y4NbSRhcqVmuz3FtmBr90oW823fuh6P3nUaAbZ-czQ7nCQwOnmM7B2eQ"
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface">Continue with Google</span>
          </a>

          <p className="text-center mt-8 font-mono text-[11px] text-on-surface-variant tracking-wide relative z-10">
            ALREADY REGISTERED?{' '}
            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/login">
              INITIALIZE SESSION
            </Link>
          </p>
        </div>

        {/* Status */}
        <div className="mt-8 flex justify-between items-center px-4 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#d3ef57]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface">Registration Open</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">WEB WEAVE '26</span>
        </div>
      </main>

      {/* BG decoration */}
      <div className="fixed top-0 left-0 w-2/3 h-full overflow-hidden pointer-events-none opacity-10 mix-blend-screen">
        <img
          alt="Circuit board background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5cbor7xSRXmFHgKdIBmmtX-_Nh0ij8GsuVOCXModWXLP7RjLtF1EN0caNT1EQQz4XUfJDMLG8dWhU9WL7upmKcBMMNBJo6kfSAuZ2A4bjdyFDGHX0lihfbZ3rB_7kJF8X06KUedcj4JvzppA6S8oL64UNXJK0DrOdXXrvTatkZMAWjAwicSaHfG8yNf621bbRXY7mwKt_5-ktCOoJ1XGRiSpeRpVobDDDoFOA3llDGSTKJ99AqPHbO3sVhyC2HT35UZm13DuuKQ"
        />
      </div>
    </div>
  )
}

export default Signup
