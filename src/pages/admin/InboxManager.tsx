import React, { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import {
  ContactMessage,
  GuestApplication,
  NewsletterSubscriber,
  getApplicationsAdmin,
  getContactMessagesAdmin,
  getSubscribersAdmin,
} from '../../lib/api'

const InboxManager: React.FC = () => {
  const [tab, setTab] = useState<'subscribers' | 'contacts' | 'applications'>('subscribers')
  const [subs, setSubs] = useState<NewsletterSubscriber[]>([])
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [apps, setApps] = useState<GuestApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const [s, c, a] = await Promise.all([
          getSubscribersAdmin().catch(() => [] as NewsletterSubscriber[]),
          getContactMessagesAdmin().catch(() => [] as ContactMessage[]),
          getApplicationsAdmin().catch(() => [] as GuestApplication[]),
        ])
        if (cancelled) return
        setSubs(s)
        setContacts(c)
        setApps(a)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load inbox')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const exportSubscribers = () => {
    const header = 'email,name,status,confirmed_at,subscription_date\n'
    const rows = subs
      .map((s) => [s.email, s.name || '', s.subscription_status, s.confirmed_at || '', s.subscription_date].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="text-gray-400 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading inbox…
      </div>
    )
  }
  if (error) return <div className="text-red-400">{error}</div>

  return (
    <div className="text-white space-y-6">
      <div className="flex gap-2">
        {(['subscribers', 'contacts', 'applications'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-purple text-white' : 'bg-navy-light text-gray-400 hover:text-white'}`}
          >
            {t} ({t === 'subscribers' ? subs.length : t === 'contacts' ? contacts.length : apps.length})
          </button>
        ))}
        {tab === 'subscribers' && (
          <button onClick={exportSubscribers} className="ml-auto btn-secondary inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {tab === 'subscribers' && (
        <Table
          columns={['Email', 'Name', 'Status', 'Confirmed', 'Subscribed']}
          rows={subs.map((s) => [s.email, s.name || '—', s.subscription_status, s.confirmed_at ? new Date(s.confirmed_at).toLocaleDateString() : '—', new Date(s.subscription_date).toLocaleDateString()])}
        />
      )}

      {tab === 'contacts' && (
        <div className="space-y-2">
          {contacts.length === 0 ? (
            <div className="text-gray-400">No contact messages yet.</div>
          ) : (
            contacts.map((c) => (
              <div key={c.id} className="bg-navy-light border border-purple/20 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{c.subject}</div>
                    <div className="text-xs text-gray-400">{c.name} &lt;{c.email}&gt; · {new Date(c.created_at).toLocaleString()}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-navy rounded">{c.status}</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-line">{c.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'applications' && (
        <div className="space-y-2">
          {apps.length === 0 ? (
            <div className="text-gray-400">No guest applications yet.</div>
          ) : (
            apps.map((a) => (
              <div key={a.id} className="bg-navy-light border border-purple/20 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-gray-400">{a.email} · {a.company || '—'} · {a.position || '—'}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-navy rounded">{a.status}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">{a.bio}</p>
                {a.expertise_areas?.length > 0 && (
                  <div className="text-xs text-gray-400">Expertise: {a.expertise_areas.join(', ')}</div>
                )}
                {a.proposed_topics?.length > 0 && (
                  <div className="text-xs text-gray-400">Topics: {a.proposed_topics.join(', ')}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const Table: React.FC<{ columns: string[]; rows: (string | number)[][] }> = ({ columns, rows }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-navy-light border border-purple/20 rounded-lg text-sm">
      <thead className="bg-navy">
        <tr>
          {columns.map((c) => (
            <th key={c} className="px-4 py-2 text-left text-gray-400 font-medium">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">No records yet.</td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className="border-t border-purple/10">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-200">{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

export default InboxManager
