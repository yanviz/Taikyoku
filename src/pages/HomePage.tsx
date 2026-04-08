import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="bg-[#0A0A0A] text-white selection:bg-primary/30 font-headline">

      {/* Announcement Ticker */}
      <div className="w-full bg-primary text-on-primary py-2 overflow-hidden z-[60] relative border-b border-white/10">
        <div className="ticker-scroll flex items-center space-x-12">
          <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.25em] whitespace-nowrap">
            SYSTEM ALERT: Next Hackathon - Cloud Native Sprint starts in T-minus 14 days • AI Workshop Registration Active • Code Dynamos Regional Engineering Award Confirmed • Release: Open Source Ledger v2.1
          </span>
          <span className="font-label text-[10px] font-extrabold uppercase tracking-[0.25em] whitespace-nowrap">
            SYSTEM ALERT: Next Hackathon - Cloud Native Sprint starts in T-minus 14 days • AI Workshop Registration Active • Code Dynamos Regional Engineering Award Confirmed • Release: Open Source Ledger v2.1
          </span>
        </div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-8 w-full z-50 px-8">
        <div className="max-w-[1440px] mx-auto bg-black/80 backdrop-blur-md border border-white/5 py-4 px-8 flex justify-between items-center rounded-lg">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-2 h-2 bg-primary inline-block" />
            CODE DYNAMOS
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <Link className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1" to="/events">
              Events
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/challenges">
              Challenges
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/team">
              Team
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/projects">
              Projects
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/gallery">
              Gallery
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/leaderboard">
              Leaderboard
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors" to="/admin">
                    Admin
                  </Link>
                )}
                <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors" to="/dashboard">
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
                <Link className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface" to="/login">
                  Login
                </Link>
                <Link
                  className="bg-primary px-6 py-2.5 rounded-sm text-on-primary font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform"
                  to="/signup"
                >
                  Join Registry
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-40">

        {/* Hero Section */}
        <section className="relative min-h-[800px] flex items-center px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(211,239,87,0.05)_0%,_transparent_50%)] z-0" />
          <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-8">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">EST 2024 / ENGINEERING LAB</span>
              </div>
              <h1 className="font-headline text-7xl md:text-8xl font-black tracking-tight leading-none mb-8 uppercase italic">
                Build. <br />
                <span className="text-primary">Compete.</span> <br />
                Connect.
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-xl mb-12 leading-relaxed border-l-2 border-white/10 pl-6">
                Operational hub for elite developers. Push architecture boundaries through high-stakes technical sprints and collaborative deep-tech initiatives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="bg-primary px-10 py-5 text-on-primary font-black text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all border border-primary"
                >
                  Initialize Access
                </Link>
                <Link
                  to="/events"
                  className="bg-transparent border border-white/20 px-10 py-5 text-on-surface font-black text-sm uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  Sprints Directory
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <div className="technical-border p-2 bg-[#141414] relative">
                <img
                  alt="Advanced code editor workspace"
                  className="grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/5] border border-white/5 w-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNmzidLD06E26fFgq1694riEB2PgiPq9Oj5ypLMPcqU32x0Jd4fe6odxf1tfw0ANNRh_toaV4r1jTnkukeo7jYUCcUM1ODqEt7ulU0SQ27--XRB5qetz4nusorJAMrkTiAm3T-vJX4KoX74DnSNNhXhgkG1_dRpYpQ7geb88_1GZ6KdnuTvfM9fFez4yx5tAqAOCJxb7yRjGoUViJ5tjWlu7ZAky6ZD9qbktZIBzdD9L-rp1PskEzzrqGtmpsxnklLIPlNYVheEQ"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-on-primary px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                  System_Active.exe
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-[#141414] border-y border-white/5 py-12">
          <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="border-l border-white/10 pl-6">
              <div className="text-4xl font-black text-primary mb-1">148</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant">Active_Operators</div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="text-4xl font-black text-white mb-1">32</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant">Sprints_Per_Annum</div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="text-4xl font-black text-white mb-1">24</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant">Live_Challenges</div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="text-4xl font-black text-primary mb-1">67</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant">Projects_Deployed</div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-24 px-8 bg-[#0A0A0A]">
          <div className="max-w-[1440px] mx-auto mb-16 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tight mb-4">Event Queue</h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface-variant transition-all">
                <span className="material-symbols-outlined text-sm">west</span>
              </button>
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface-variant transition-all">
                <span className="material-symbols-outlined text-sm">east</span>
              </button>
            </div>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-12 snap-x no-scrollbar">
            {/* Event Card 1 */}
            <div className="flex-none w-[420px] snap-center lab-panel group">
              <div className="h-60 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img
                  alt="Tech conference"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXn_-T0r_UBnvyAglmFKHY5SDS8pe33avm0AXhQOgO_pWfjILY84z7cCOrT4CTe95irAZzgKBdWIsp8vx0GeYXYcf_udQPu3L3nIySJOsv7pJBVdGGs6CwVm9O_Azd4FefJSyt2cki706imdO1WQYLTEl_zC2TDvSbK9zOzN75S0gBbzlIQwKEID519kvxQnq51eJSpZE1FV_Au4nYRrLUr8P0hHQGIiFsYLu-xecP_ErTnk6-Yi-o1TEkEU3C3JeIKskJgXfswg"
                />
                <div className="absolute top-0 right-0 bg-primary px-3 py-1.5 text-on-primary text-[10px] font-bold uppercase tracking-widest">
                  WORKSHOP
                </div>
              </div>
              <div className="p-8 border-t border-white/5">
                <div className="text-[10px] font-bold text-primary tracking-[0.3em] mb-4">MAY 24, 2026 / 18:00 UTC</div>
                <h3 className="text-2xl font-black uppercase mb-4 leading-tight group-hover:text-primary transition-colors">
                  Advanced Rust for Systems Architecture
                </h3>
                <p className="text-sm text-on-surface-variant mb-8 line-clamp-2">
                  Technical dive into memory safety and zero-cost abstractions for production-grade systems.
                </p>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                  EXECUTE RSVP <span className="w-4 h-[1px] bg-primary inline-block" />
                </button>
              </div>
            </div>
            {/* Event Card 2 */}
            <div className="flex-none w-[420px] snap-center lab-panel group">
              <div className="h-60 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img
                  alt="Hackathon team working"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv5Fzz17-szQHNuORsgeozQsFTnlFtyDmKKZABXD6NDOwCS8wG9dfPcPugyI2fqMSQ-R3VQ-pZRZ05Hyz1QrHqCvePVKU3pW_ZxHyBegnLjB5e-ja2ZR3c_TYaslwbUtI17NhK2IKwJK7zGiXCAZThPCKhsKzwf13jHViOFnPbe9bL3lDhSiqgQlytPnWaoJl0g3h_oJLmbjmssITVnJ1E_29Gous4Rw_EVZpKUm6rwGFCxl1vEA9p7WrBp5jU0HovIs95LTFRlQ"
                />
                <div className="absolute top-0 right-0 bg-white px-3 py-1.5 text-black text-[10px] font-bold uppercase tracking-widest">
                  HACKATHON
                </div>
              </div>
              <div className="p-8 border-t border-white/5">
                <div className="text-[10px] font-bold text-on-surface-variant tracking-[0.3em] mb-4">JUN 02, 2026 / 09:00 UTC</div>
                <h3 className="text-2xl font-black uppercase mb-4 leading-tight group-hover:text-primary transition-colors">
                  Cybersecurity 48H Lockdown Challenge
                </h3>
                <p className="text-sm text-on-surface-variant mb-8 line-clamp-2">
                  High-intensity security simulation focusing on real-time patching and threat mitigation.
                </p>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary flex items-center gap-3 transition-colors">
                  JOIN QUEUE <span className="w-4 h-[1px] bg-current inline-block" />
                </button>
              </div>
            </div>
            {/* Event Card 3 */}
            <div className="flex-none w-[420px] snap-center lab-panel group">
              <div className="h-60 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img
                  alt="AI visualization"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyENExTqDtoPgcm5nWzFqYCTIRFSbzmt41nIWHDgRTjWX8uSafcHb9rBFoGB6Al9amVPPF-QZXmHuAyme642ZKhf_n2v2esKFcgW1ys-uVfpGshzCH12SU_EOcSh7UYYNO0jR1Gv2Z1Q8wr203PGk1GiF8eqdL9CguEVeKMU0Hswl6olj5zZbXehtJj2hbmzutKkCZqOTyZNu6kg3D8Hi8as7IpnQUi-pdE4-DdckYYp8oTWVFvJgT-_xVHKe4AHajTnloCcvQfg"
                />
                <div className="absolute top-0 right-0 bg-primary px-3 py-1.5 text-on-primary text-[10px] font-bold uppercase tracking-widest">
                  MEETUP
                </div>
              </div>
              <div className="p-8 border-t border-white/5">
                <div className="text-[10px] font-bold text-primary tracking-[0.3em] mb-4">JUN 15, 2026 / 14:00 UTC</div>
                <h3 className="text-2xl font-black uppercase mb-4 leading-tight group-hover:text-primary transition-colors">
                  LLM Ethics &amp; Deployment Strategies
                </h3>
                <p className="text-sm text-on-surface-variant mb-8 line-clamp-2">
                  Deep dive into productionizing large models while maintaining ethical guardrails.
                </p>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                  RESERVE SLOT <span className="w-4 h-[1px] bg-primary inline-block" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Current Sprints / Featured Challenges */}
        <section className="py-24 bg-[#141414] px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-20">
              <div className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-4">ACTIVE OPERATIONS</div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Current Sprints</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 — Legendary */}
              <div className="md:row-span-2 lab-panel p-10 flex flex-col justify-between border-t-2 border-primary">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <span className="material-symbols-outlined text-4xl text-primary">terminal</span>
                    <span className="border border-primary text-primary text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter">CLASS: LEGENDARY</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 italic">The Kernel Architect</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
                    Low-level optimization challenge: build a priority-based scheduler in pure C (max 500 lines).
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                    <span>POOL: $2,500</span>
                    <span>COMPLETION: 65%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 mb-10">
                    <div className="bg-primary h-full w-2/3" />
                  </div>
                  <button className="w-full py-4 bg-primary text-on-primary font-black text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all">
                    INITIALIZE
                  </button>
                </div>
              </div>
              {/* Challenge 2 */}
              <div className="lab-panel p-8 group border-l border-white/10">
                <div className="flex justify-between items-start mb-8">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">database</span>
                  <span className="text-[8px] font-bold text-on-surface-variant border border-white/20 px-2 py-0.5 uppercase">HARD</span>
                </div>
                <h3 className="text-xl font-black uppercase mb-4 italic">Query Ninja</h3>
                <p className="text-xs text-on-surface-variant mb-8">
                  High-performance database optimization: reduce query latency on a 10M-row dataset.
                </p>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  <span>POOL: $800</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-white/40 h-full w-5/12" />
                </div>
              </div>
              {/* Challenge 3 */}
              <div className="lab-panel p-8 group border-l border-white/10">
                <div className="flex justify-between items-start mb-8">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">hub</span>
                  <span className="text-[8px] font-bold text-on-surface-variant border border-white/20 px-2 py-0.5 uppercase">MEDIUM</span>
                </div>
                <h3 className="text-xl font-black uppercase mb-4 italic">Graph Weaver</h3>
                <p className="text-xs text-on-surface-variant mb-8">
                  Implement a real-time collaborative graph editor with conflict-free replicated data types.
                </p>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  <span>POOL: $600</span>
                  <span>71%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-white/40 h-full w-8/12" />
                </div>
              </div>
              {/* Challenge 4 */}
              <div className="lab-panel p-8 group border-l border-white/10">
                <div className="flex justify-between items-start mb-8">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">memory</span>
                  <span className="text-[8px] font-bold text-on-surface-variant border border-white/20 px-2 py-0.5 uppercase">HARD</span>
                </div>
                <h3 className="text-xl font-black uppercase mb-4 italic">Cache Architect</h3>
                <p className="text-xs text-on-surface-variant mb-8">
                  Design a distributed cache layer that achieves sub-millisecond read latency at 99th percentile.
                </p>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  <span>POOL: $1,200</span>
                  <span>28%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-white/40 h-full w-3/12" />
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/challenges"
                className="border border-white/20 px-12 py-4 text-sm font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all inline-block"
              >
                View All Active Sprints
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="text-xl font-black tracking-tighter flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-primary inline-block" />
                CODE DYNAMOS
              </div>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Web Weave '26 — Technical Excellence Platform for elite developers.
              </p>
            </div>
            <div className="flex gap-16 text-xs font-bold uppercase tracking-widest">
              <div className="space-y-4">
                <div className="text-on-surface-variant mb-6">Platform</div>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/events">Events</Link>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/challenges">Challenges</Link>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/leaderboard">Leaderboard</Link>
              </div>
              <div className="space-y-4">
                <div className="text-on-surface-variant mb-6">Community</div>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/team">Team</Link>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/projects">Projects</Link>
                <Link className="block text-on-surface-variant hover:text-primary transition-colors" to="/gallery">Gallery</Link>
              </div>
            </div>
          </div>
          <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
              © 2026 Code Dynamos. All rights reserved.
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#d3ef57]" />
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Systems Nominal</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}

export default HomePage
