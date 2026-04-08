import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

type Tab = 'overview' | 'members' | 'events' | 'challenges'

interface Stats { totalMembers: number; activeEvents: number; totalEvents: number; totalChallenges: number; totalProjects: number; totalXpAwarded: number }
interface Member { id: string; email: string; name: string; role: string; xp: number; badge: string; track: string; streak: number; challenges: number; createdAt: string }
interface Event { id: string; type: string; date: string; title: string; description: string; slots: number; total: number; status: string; location: string; accent: string }
interface Challenge { id: string; title: string; difficulty: string; xp: number; pool: number; completions: number; participants: number; tags: string[]; description: string }

const DIFF_COLORS: Record<string, string> = { Legendary: 'text-primary', Hard: 'text-error', Medium: 'text-secondary', Easy: 'text-tertiary-fixed' }

const blankEvent = (): Partial<Event> => ({ type: 'Workshop', date: '', title: '', description: '', slots: 30, total: 30, status: 'Open', location: '', accent: '#d3ef57' })
const blankChallenge = (): Partial<Challenge> => ({ title: '', difficulty: 'Medium', xp: 500, pool: 2500, description: '', tags: [] })

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>('overview')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Modal state
  const [eventModal, setEventModal] = useState<{ open: boolean; data: Partial<Event>; editing: boolean }>({ open: false, data: blankEvent(), editing: false })
  const [challengeModal, setChallengeModal] = useState<{ open: boolean; data: Partial<Challenge>; editing: boolean }>({ open: false, data: blankChallenge(), editing: false })
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'event' | 'challenge'; id: string } | null>(null)

  const handleLogout = () => { logout(); navigate('/login') }

  // Queries
  const { data: stats } = useQuery<Stats>({ queryKey: ['admin-stats'], queryFn: () => api.get('/admin/stats').then(r => r.data) })
  const { data: members = [] } = useQuery<Member[]>({ queryKey: ['admin-members'], queryFn: () => api.get('/admin/members').then(r => r.data), enabled: tab === 'members' })
  const { data: events = [] } = useQuery<Event[]>({ queryKey: ['admin-events'], queryFn: () => api.get('/admin/events').then(r => r.data), enabled: tab === 'events' })
  const { data: challenges = [] } = useQuery<Challenge[]>({ queryKey: ['admin-challenges'], queryFn: () => api.get('/admin/challenges').then(r => r.data), enabled: tab === 'challenges' })

  // Member role mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.patch(`/admin/members/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members'] }),
  })

  // Event mutations
  const createEventMutation = useMutation({
    mutationFn: (data: Partial<Event>) => api.post('/admin/events', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-events'] }); setEventModal({ open: false, data: blankEvent(), editing: false }) },
  })
  const updateEventMutation = useMutation({
    mutationFn: (data: Partial<Event>) => api.patch(`/admin/events/${data.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-events'] }); setEventModal({ open: false, data: blankEvent(), editing: false }) },
  })
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/events/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-events'] }); setDeleteConfirm(null) },
  })

  // Challenge mutations
  const createChallengeMutation = useMutation({
    mutationFn: (data: Partial<Challenge>) => api.post('/admin/challenges', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-challenges'] }); setChallengeModal({ open: false, data: blankChallenge(), editing: false }) },
  })
  const updateChallengeMutation = useMutation({
    mutationFn: (data: Partial<Challenge>) => api.patch(`/admin/challenges/${data.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-challenges'] }); setChallengeModal({ open: false, data: blankChallenge(), editing: false }) },
  })
  const deleteChallengeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/challenges/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-challenges'] }); setDeleteConfirm(null) },
  })

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'members', icon: 'group', label: 'Members' },
    { id: 'events', icon: 'event', label: 'Events' },
    { id: 'challenges', icon: 'terminal', label: 'Challenges' },
  ]

  return (
    <div className="overflow-x-hidden bg-[#0d141c] min-h-screen text-white font-headline">

      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-[#151c24] border-r border-white/5 z-50">
        <div className="flex flex-col h-full py-8 px-4">
          <div className="mb-10 px-2">
            <h1 className="text-primary font-black text-xl tracking-tighter uppercase">CODE DYNAMOS</h1>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold transition-all ${
                  tab === item.id
                    ? 'text-primary bg-[#192028] border-r-4 border-primary'
                    : 'text-slate-400 hover:text-white hover:bg-[#192028]'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-lg">{item.icon}</span>
                <span className="font-mono uppercase tracking-wider text-xs">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-1 pt-6 border-t border-white/5">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="font-pixel text-xs text-primary">{user?.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{user?.name}</div>
                <div className="text-[10px] text-primary font-mono uppercase">Admin</div>
              </div>
            </div>
            <Link to="/" className="flex items-center px-4 py-2 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined mr-3 text-sm">home</span>
              <span className="font-mono uppercase tracking-wider text-xs font-bold">Site Home</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-slate-400 hover:text-error transition-colors">
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              <span className="font-mono uppercase tracking-wider text-xs font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-[#0d141c]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-8">
        <div className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
          Admin / <span className="text-white capitalize">{tab}</span>
        </div>
      </header>

      {/* Main */}
      <main className="ml-64 pt-20 p-8 min-h-screen">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div className="mb-10">
              <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-on-surface-variant mb-2">SYSTEM OVERVIEW</div>
              <h2 className="text-4xl font-black tracking-tighter">Mission Control</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Total Members', value: stats?.totalMembers ?? '—', icon: 'group', accent: '#d3ef57' },
                { label: 'Total Events', value: stats?.totalEvents ?? '—', icon: 'event', accent: '#dbb8ff' },
                { label: 'Active Events', value: stats?.activeEvents ?? '—', icon: 'event_available', accent: '#74facb' },
                { label: 'Challenges', value: stats?.totalChallenges ?? '—', icon: 'terminal', accent: '#ffb4ab' },
                { label: 'Projects', value: stats?.totalProjects ?? '—', icon: 'science', accent: '#d3ef57' },
                { label: 'Total XP Awarded', value: stats?.totalXpAwarded?.toLocaleString() ?? '—', icon: 'bolt', accent: '#dbb8ff' },
              ].map((s) => (
                <div key={s.label} className="bg-surface-container-low p-6 border-l-4 flex flex-col gap-3" style={{ borderLeftColor: s.accent }}>
                  <span className="material-symbols-outlined" style={{ color: s.accent }}>{s.icon}</span>
                  <div className="text-3xl font-black" style={{ color: s.accent }}>{s.value}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setTab('events')} className="bg-surface-container p-6 border border-outline-variant/10 hover:border-primary/30 transition-all text-left group">
                <span className="material-symbols-outlined text-primary text-2xl mb-3 block">event</span>
                <div className="font-mono font-black uppercase text-sm group-hover:text-primary transition-colors">Manage Events</div>
                <div className="text-xs text-on-surface-variant mt-1">Create, edit, delete events</div>
              </button>
              <button onClick={() => setTab('challenges')} className="bg-surface-container p-6 border border-outline-variant/10 hover:border-primary/30 transition-all text-left group">
                <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">terminal</span>
                <div className="font-mono font-black uppercase text-sm group-hover:text-primary transition-colors">Manage Challenges</div>
                <div className="text-xs text-on-surface-variant mt-1">Create, edit, delete sprints</div>
              </button>
              <button onClick={() => setTab('members')} className="bg-surface-container p-6 border border-outline-variant/10 hover:border-primary/30 transition-all text-left group">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl mb-3 block">group</span>
                <div className="font-mono font-black uppercase text-sm group-hover:text-primary transition-colors">View Members</div>
                <div className="text-xs text-on-surface-variant mt-1">See all registered users, change roles</div>
              </button>
              <div className="bg-surface-container p-6 border border-outline-variant/10">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl mb-3 block">lock</span>
                <div className="font-mono font-black uppercase text-sm text-on-surface-variant/40">More Coming Soon</div>
                <div className="text-xs text-on-surface-variant/30 mt-1">Analytics, gallery, projects</div>
              </div>
            </div>
          </div>
        )}

        {/* ── MEMBERS ── */}
        {tab === 'members' && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-on-surface-variant mb-2">OPERATOR REGISTRY</div>
                <h2 className="text-4xl font-black tracking-tighter">Members <span className="text-primary">({members.length})</span></h2>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high">
                    <tr>
                      {['Operator', 'Track', 'Badge', 'XP', 'Streak', 'Challenges', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-surface-bright/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <span className="font-pixel text-xs text-primary">{m.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <div className="font-bold text-sm">{m.name}</div>
                              <div className="text-[10px] text-on-surface-variant font-mono">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-on-surface-variant">{m.track}</td>
                        <td className="px-4 py-4">
                          <span className="text-[9px] font-mono font-black px-2 py-0.5 border border-primary/30 text-primary uppercase">{m.badge}</span>
                        </td>
                        <td className="px-4 py-4 font-mono text-sm text-primary font-bold">{m.xp.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono text-sm text-on-surface-variant">{m.streak}d</td>
                        <td className="px-4 py-4 font-mono text-sm text-on-surface-variant">{m.challenges}</td>
                        <td className="px-4 py-4">
                          <span className={`text-[9px] font-mono font-black px-2 py-0.5 border uppercase ${m.role === 'admin' ? 'text-primary border-primary' : 'text-on-surface-variant border-outline-variant'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-[10px] text-on-surface-variant">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => roleMutation.mutate({ id: m.id, role: m.role === 'admin' ? 'member' : 'admin' })}
                            className="text-[9px] font-mono px-2 py-1 border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors uppercase"
                          >
                            {m.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── EVENTS ── */}
        {tab === 'events' && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-on-surface-variant mb-2">EVENT MANAGEMENT</div>
                <h2 className="text-4xl font-black tracking-tighter">Events <span className="text-primary">({events.length})</span></h2>
              </div>
              <button
                onClick={() => setEventModal({ open: true, data: blankEvent(), editing: false })}
                className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 font-mono font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New Event
              </button>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="bg-surface-container p-5 border border-outline-variant/10 flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[9px] font-mono font-black px-2 py-0.5 bg-primary/10 text-primary uppercase">{ev.type}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 border uppercase ${ev.status === 'Open' ? 'border-tertiary-fixed/30 text-tertiary-fixed' : 'border-error/30 text-error'}`}>{ev.status}</span>
                    </div>
                    <div className="font-bold text-white">{ev.title}</div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-1">{ev.date} · {ev.location} · {ev.slots}/{ev.total} slots</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEventModal({ open: true, data: { ...ev }, editing: true })}
                      className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-bright transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'event', id: ev.id })}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHALLENGES ── */}
        {tab === 'challenges' && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-on-surface-variant mb-2">CHALLENGE MANAGEMENT</div>
                <h2 className="text-4xl font-black tracking-tighter">Challenges <span className="text-primary">({challenges.length})</span></h2>
              </div>
              <button
                onClick={() => setChallengeModal({ open: true, data: blankChallenge(), editing: false })}
                className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 font-mono font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New Challenge
              </button>
            </div>

            <div className="space-y-3">
              {challenges.map((ch) => (
                <div key={ch.id} className="bg-surface-container p-5 border border-outline-variant/10 flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 border uppercase ${DIFF_COLORS[ch.difficulty] ?? 'text-on-surface-variant'} border-current`}>{ch.difficulty}</span>
                      <span className="text-[9px] font-mono text-on-surface-variant">{ch.participants} participants</span>
                    </div>
                    <div className="font-bold text-white">{ch.title}</div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-1">+{ch.xp} XP · ₹{ch.pool.toLocaleString()} pool · {ch.tags.join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChallengeModal({ open: true, data: { ...ch }, editing: true })}
                      className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-bright transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'challenge', id: ch.id })}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── EVENT MODAL ── */}
      {eventModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#151c24] border border-outline-variant/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-mono font-black uppercase text-sm">{eventModal.editing ? 'Edit Event' : 'New Event'}</h3>
              <button onClick={() => setEventModal({ open: false, data: blankEvent(), editing: false })} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {([
                { field: 'title', label: 'Title', type: 'text' },
                { field: 'type', label: 'Type', type: 'select', options: ['Workshop', 'Hackathon', 'Meetup', 'Competition'] },
                { field: 'date', label: 'Date (e.g. MAY 24)', type: 'text' },
                { field: 'location', label: 'Location', type: 'text' },
                { field: 'description', label: 'Description', type: 'textarea' },
                { field: 'slots', label: 'Available Slots', type: 'number' },
                { field: 'total', label: 'Total Capacity', type: 'number' },
                { field: 'status', label: 'Status', type: 'select', options: ['Open', 'Full', 'Closing Soon'] },
              ] as Array<{ field: keyof Event; label: string; type: string; options?: string[] }>).map(({ field, label, type, options }) => (
                <div key={field}>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block mb-1">{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      value={(eventModal.data[field] as string) ?? ''}
                      onChange={(e) => setEventModal(s => ({ ...s, data: { ...s.data, [field]: e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body resize-none h-20 focus:outline-none"
                    />
                  ) : type === 'select' ? (
                    <select
                      value={(eventModal.data[field] as string) ?? ''}
                      onChange={(e) => setEventModal(s => ({ ...s, data: { ...s.data, [field]: e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body focus:outline-none"
                    >
                      {options!.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={(eventModal.data[field] as string | number) ?? ''}
                      onChange={(e) => setEventModal(s => ({ ...s, data: { ...s.data, [field]: type === 'number' ? Number(e.target.value) : e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-outline-variant/10 flex gap-3 justify-end">
              <button onClick={() => setEventModal({ open: false, data: blankEvent(), editing: false })} className="px-4 py-2 text-xs font-mono uppercase text-on-surface-variant hover:text-white border border-outline-variant/30 hover:border-white/30 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => eventModal.editing ? updateEventMutation.mutate(eventModal.data) : createEventMutation.mutate(eventModal.data)}
                disabled={createEventMutation.isPending || updateEventMutation.isPending}
                className="px-4 py-2 text-xs font-mono uppercase bg-primary text-on-primary hover:bg-white disabled:opacity-50 transition-colors font-black"
              >
                {eventModal.editing ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHALLENGE MODAL ── */}
      {challengeModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#151c24] border border-outline-variant/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-mono font-black uppercase text-sm">{challengeModal.editing ? 'Edit Challenge' : 'New Challenge'}</h3>
              <button onClick={() => setChallengeModal({ open: false, data: blankChallenge(), editing: false })} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {([
                { field: 'title', label: 'Title', type: 'text' },
                { field: 'difficulty', label: 'Difficulty', type: 'select', options: ['Legendary', 'Hard', 'Medium', 'Easy'] },
                { field: 'description', label: 'Description', type: 'textarea' },
                { field: 'xp', label: 'XP Reward', type: 'number' },
                { field: 'pool', label: 'Prize Pool (₹)', type: 'number' },
                { field: 'tags', label: 'Tags (comma separated)', type: 'tags' },
              ] as Array<{ field: keyof Challenge; label: string; type: string; options?: string[] }>).map(({ field, label, type, options }) => (
                <div key={field}>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant block mb-1">{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      value={(challengeModal.data[field] as string) ?? ''}
                      onChange={(e) => setChallengeModal(s => ({ ...s, data: { ...s.data, [field]: e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body resize-none h-20 focus:outline-none"
                    />
                  ) : type === 'select' ? (
                    <select
                      value={(challengeModal.data[field] as string) ?? ''}
                      onChange={(e) => setChallengeModal(s => ({ ...s, data: { ...s.data, [field]: e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body focus:outline-none"
                    >
                      {options!.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : type === 'tags' ? (
                    <input
                      type="text"
                      value={Array.isArray(challengeModal.data.tags) ? challengeModal.data.tags.join(', ') : ''}
                      onChange={(e) => setChallengeModal(s => ({ ...s, data: { ...s.data, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body focus:outline-none"
                      placeholder="SQL, Redis, Algorithms"
                    />
                  ) : (
                    <input
                      type={type}
                      value={(challengeModal.data[field] as string | number) ?? ''}
                      onChange={(e) => setChallengeModal(s => ({ ...s, data: { ...s.data, [field]: type === 'number' ? Number(e.target.value) : e.target.value } }))}
                      className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary rounded-sm p-3 text-sm text-white font-body focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-outline-variant/10 flex gap-3 justify-end">
              <button onClick={() => setChallengeModal({ open: false, data: blankChallenge(), editing: false })} className="px-4 py-2 text-xs font-mono uppercase text-on-surface-variant hover:text-white border border-outline-variant/30 hover:border-white/30 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => challengeModal.editing ? updateChallengeMutation.mutate(challengeModal.data) : createChallengeMutation.mutate(challengeModal.data)}
                disabled={createChallengeMutation.isPending || updateChallengeMutation.isPending}
                className="px-4 py-2 text-xs font-mono uppercase bg-primary text-on-primary hover:bg-white disabled:opacity-50 transition-colors font-black"
              >
                {challengeModal.editing ? 'Save Changes' : 'Create Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#151c24] border border-error/20 w-full max-w-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-error text-2xl">warning</span>
              <h3 className="font-mono font-black uppercase text-sm text-error">Confirm Delete</h3>
            </div>
            <p className="text-sm text-on-surface-variant font-body mb-6">
              This will permanently delete this {deleteConfirm.type}. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-xs font-mono uppercase text-on-surface-variant hover:text-white border border-outline-variant/30 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm.type === 'event'
                  ? deleteEventMutation.mutate(deleteConfirm.id)
                  : deleteChallengeMutation.mutate(deleteConfirm.id)
                }
                disabled={deleteEventMutation.isPending || deleteChallengeMutation.isPending}
                className="px-4 py-2 text-xs font-mono uppercase bg-error text-white hover:brightness-110 disabled:opacity-50 font-black transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
