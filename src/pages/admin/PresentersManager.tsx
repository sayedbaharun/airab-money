import React, { useEffect, useState } from 'react'
import { Plus, Save, Trash2, Edit, Upload, Loader2 } from 'lucide-react'
import {
  Presenter,
  createPresenter,
  deletePresenter,
  getPresenters,
  updatePresenter,
  uploadFile,
} from '../../lib/api'

interface FormState {
  id?: string
  name: string
  slug: string
  role: string
  bio: string
  photo_url: string
  show_types: string
  linkedin_url: string
  twitter_url: string
  website_url: string
  featured: boolean
  display_order: number
}

const blankForm: FormState = {
  name: '',
  slug: '',
  role: '',
  bio: '',
  photo_url: '',
  show_types: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  featured: false,
  display_order: 0,
}

const PresentersManager: React.FC = () => {
  const [presenters, setPresenters] = useState<Presenter[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(blankForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      const data = await getPresenters()
      setPresenters(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch presenters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const edit = (p: Presenter) => {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      role: p.role,
      bio: p.bio,
      photo_url: p.photo_url || '',
      show_types: p.show_types.join(', '),
      linkedin_url: p.linkedin_url || '',
      twitter_url: p.twitter_url || '',
      website_url: p.website_url || '',
      featured: p.featured,
      display_order: p.display_order,
    })
  }

  const reset = () => {
    setForm(blankForm)
    setMessage(null)
    setError(null)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadFile('image', file)
      setForm((f) => ({ ...f, photo_url: result.url }))
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
      const payload: Partial<Presenter> = {
        name: form.name,
        slug: form.slug || undefined,
        role: form.role,
        bio: form.bio,
        photo_url: form.photo_url || null,
        show_types: form.show_types.split(',').map((s) => s.trim()).filter(Boolean),
        linkedin_url: form.linkedin_url || null,
        twitter_url: form.twitter_url || null,
        website_url: form.website_url || null,
        featured: form.featured,
        display_order: form.display_order,
      }

      if (form.id) {
        await updatePresenter(form.id, payload)
        setMessage('Presenter updated.')
      } else {
        await createPresenter(payload)
        setMessage('Presenter created.')
      }
      reset()
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this presenter?')) return
    try {
      await deletePresenter(id)
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={save} className="bg-navy-light border border-purple/30 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">{form.id ? 'Edit Presenter' : 'New Presenter'}</h2>

          <Field label="Name"><input className="input" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Slug (optional)"><input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Role"><input className="input" value={form.role} required onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
          <Field label="Bio"><textarea className="input h-28" value={form.bio} required onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>

          <Field label="Photo">
            <div className="flex gap-2 items-center">
              <input className="input flex-1" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </Field>

          <Field label="Show types (comma-separated)"><input className="input" value={form.show_types} onChange={(e) => setForm({ ...form, show_types: e.target.value })} /></Field>
          <Field label="LinkedIn URL"><input className="input" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></Field>
          <Field label="Twitter URL"><input className="input" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} /></Field>
          <Field label="Website URL"><input className="input" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Display order"><input type="number" className="input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} /></Field>
            <div className="flex items-center gap-2 pt-6">
              <input id="presfeat" type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <label htmlFor="presfeat" className="text-sm text-gray-300">Featured</label>
            </div>
          </div>

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
            <h2 className="text-xl font-bold">Presenters ({presenters.length})</h2>
            <button onClick={reset} className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> New</button>
          </div>
          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : presenters.length === 0 ? (
            <div className="text-gray-400">No presenters yet.</div>
          ) : (
            <ul className="space-y-2 max-h-[640px] overflow-y-auto">
              {presenters.map((p) => (
                <li key={p.id} className="p-3 bg-navy rounded border border-purple/20 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-3">
                    {p.photo_url && <img src={p.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => edit(p)} className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => remove(p.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
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

export default PresentersManager
