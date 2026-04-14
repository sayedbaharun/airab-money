import React, { useEffect, useState } from 'react'
import { Plus, Save, Trash2, Edit, Upload, Loader2 } from 'lucide-react'
import {
  PodcastEpisode,
  createEpisode,
  deleteEpisode,
  getEpisodes,
  updateEpisode,
  uploadFile,
} from '../../lib/api'

interface FormState {
  id?: string
  title: string
  description: string
  episode_number: number
  season_number: number
  show_type: string
  duration_minutes: number
  audio_url: string
  featured_image_url: string
  publish_date: string
  status: string
  guest_name: string
  guest_bio: string
  topics: string
  categories: string
  featured: boolean
}

const blankForm: FormState = {
  title: '',
  description: '',
  episode_number: 1,
  season_number: 1,
  show_type: 'Money Moves',
  duration_minutes: 30,
  audio_url: '',
  featured_image_url: '',
  publish_date: new Date().toISOString().slice(0, 10),
  status: 'published',
  guest_name: '',
  guest_bio: '',
  topics: '',
  categories: '',
  featured: false,
}

const EpisodesManager: React.FC = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(blankForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      const resp = await getEpisodes({ pageSize: 100 })
      setEpisodes(resp.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch episodes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const edit = (ep: PodcastEpisode) => {
    setForm({
      id: ep.id,
      title: ep.title,
      description: ep.description,
      episode_number: ep.episode_number,
      season_number: ep.season_number,
      show_type: ep.show_type,
      duration_minutes: ep.duration_minutes,
      audio_url: ep.audio_url,
      featured_image_url: ep.featured_image_url || '',
      publish_date: ep.publish_date.slice(0, 10),
      status: ep.status,
      guest_name: ep.guest_name || '',
      guest_bio: ep.guest_bio || '',
      topics: ep.topics.join(', '),
      categories: ep.categories.join(', '),
      featured: ep.featured,
    })
  }

  const reset = () => {
    setForm(blankForm)
    setMessage(null)
    setError(null)
  }

  const handleUpload = async (kind: 'audio' | 'image', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadFile(kind, file)
      if (kind === 'audio') {
        setForm((f) => ({ ...f, audio_url: result.url }))
      } else {
        setForm((f) => ({ ...f, featured_image_url: result.url }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        episode_number: form.episode_number,
        season_number: form.season_number,
        show_type: form.show_type,
        duration_minutes: form.duration_minutes,
        audio_url: form.audio_url,
        featured_image_url: form.featured_image_url || null,
        publish_date: form.publish_date,
        status: form.status,
        guest_name: form.guest_name || null,
        guest_bio: form.guest_bio || null,
        topics: form.topics.split(',').map((s) => s.trim()).filter(Boolean),
        categories: form.categories.split(',').map((s) => s.trim()).filter(Boolean),
        featured: form.featured,
      } as Partial<PodcastEpisode> & { topics: string[]; categories: string[] }

      if (form.id) {
        await updateEpisode(form.id, payload as Partial<PodcastEpisode>)
        setMessage('Episode updated.')
      } else {
        await createEpisode(payload as Partial<PodcastEpisode>)
        setMessage('Episode created.')
      }
      reset()
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save episode')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this episode?')) return
    try {
      await deleteEpisode(id)
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={save} className="bg-navy-light border border-purple/30 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">{form.id ? 'Edit Episode' : 'New Episode'}</h2>

          <Field label="Title"><input className="input" value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><textarea className="input h-28" value={form.description} required onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Episode #"><input type="number" className="input" value={form.episode_number} onChange={(e) => setForm({ ...form, episode_number: Number(e.target.value) })} /></Field>
            <Field label="Season #"><input type="number" className="input" value={form.season_number} onChange={(e) => setForm({ ...form, season_number: Number(e.target.value) })} /></Field>
            <Field label="Duration (min)"><input type="number" className="input" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Show Type">
              <select className="input" value={form.show_type} onChange={(e) => setForm({ ...form, show_type: e.target.value })}>
                <option>Money Moves</option>
                <option>Wisdom Wednesday</option>
                <option>Future Friday</option>
              </select>
            </Field>
            <Field label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </Field>
          </div>

          <Field label="Publish Date"><input type="date" className="input" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} /></Field>

          <Field label="Audio file">
            <div className="flex gap-2 items-center">
              <input className="input flex-1" value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} placeholder="/media/..." />
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleUpload('audio', e)} />
              </label>
            </div>
          </Field>

          <Field label="Cover image">
            <div className="flex gap-2 items-center">
              <input className="input flex-1" value={form.featured_image_url} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} placeholder="/media/..." />
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload('image', e)} />
              </label>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Guest name"><input className="input" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} /></Field>
            <Field label="Featured"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /></Field>
          </div>

          <Field label="Guest bio"><textarea className="input h-20" value={form.guest_bio} onChange={(e) => setForm({ ...form, guest_bio: e.target.value })} /></Field>
          <Field label="Topics (comma-separated)"><input className="input" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} /></Field>
          <Field label="Categories (comma-separated)"><input className="input" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} /></Field>

          {message && <div className="text-emerald-400 text-sm">{message}</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {form.id ? 'Update' : 'Create'}
            </button>
            {form.id && <button type="button" onClick={reset} className="text-gray-400 hover:text-white">Cancel</button>}
          </div>
        </form>

        <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Episodes ({episodes.length})</h2>
            <button onClick={reset} className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> New</button>
          </div>
          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : episodes.length === 0 ? (
            <div className="text-gray-400">No episodes yet.</div>
          ) : (
            <ul className="space-y-2 max-h-[640px] overflow-y-auto">
              {episodes.map((ep) => (
                <li key={ep.id} className="p-3 bg-navy rounded border border-purple/20 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{ep.title}</div>
                    <div className="text-xs text-gray-400">{ep.show_type} · E{ep.episode_number} · {ep.status}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => edit(ep)} className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => remove(ep.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    {children}
  </div>
)

export default EpisodesManager
