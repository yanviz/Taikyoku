import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Events', to: '/events' },
  { label: 'Challenges', to: '/challenges' },
  { label: 'Team', to: '/team' },
  { label: 'Projects', to: '/projects' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Leaderboard', to: '/leaderboard' },
]

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-headline">
      {/* Ticker */}
      <div className="w-full bg-primary text-on-primary py-2 overflow-hidden z-[60] relative">
        <div className="ticker-scroll flex items-center space-x-12">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap">
            WEB WEAVE '26 — Registration Open • Cloud Native Sprint T-minus 14 days • AI Workshop Active • Regional Award Confirmed
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap">
            WEB WEAVE '26 — Registration Open • Cloud Native Sprint T-minus 14 days • AI Workshop Active • Regional Award Confirmed
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-8 w-full z-50 px-8">
        <div className="max-w-[1440px] mx-auto bg-black/80 backdrop-blur-md border border-white/5 py-4 px-8 flex justify-between items-center rounded-lg">
          <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-2 h-2 bg-primary inline-block" />
            CODE DYNAMOS
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  pathname === to
                    ? 'text-primary border-b border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors">
                  Logout
                </button>
                <Link to="/dashboard" className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="font-pixel text-xs text-primary">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary px-6 py-2.5 rounded-sm text-on-primary font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">
                  Join Registry
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-28">{children}</div>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 px-8 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="text-xl font-black tracking-tighter flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-primary inline-block" />
              CODE DYNAMOS
            </div>
            <p className="text-xs text-on-surface-variant max-w-xs font-body">
              Web Weave '26 — Technical Excellence Platform for elite developers.
            </p>
          </div>
          <div className="flex gap-16 text-xs font-bold uppercase tracking-widest">
            <div className="space-y-4">
              <div className="text-on-surface-variant mb-6">Platform</div>
              {navLinks.map(({ label, to }) => (
                <Link key={to} className="block text-on-surface-variant hover:text-primary transition-colors" to={to}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <div className="text-on-surface-variant mb-6">Account</div>
              <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/login">Login</Link>
              <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/signup">Sign Up</Link>
              <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest">© 2026 Code Dynamos. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#d3ef57]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">Systems Nominal</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
