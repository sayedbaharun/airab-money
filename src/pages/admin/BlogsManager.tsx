import React, { useEffect, useState } from 'react'
import { Plus, Save, Trash2, Edit, Upload, Loader2 } from 'lucide-react'
import {
  BlogPost,
  createBlogPost,
  deleteBlogPost,
  getBlogPosts,
  updateBlogPost,
  uploadFile,
} from '../../lib/api'

interface FormState {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  author_name: string
  category: string
  tags: string
  status: string
  featured: boolean
  featured_image_url: string
  estimated_read_time: number
  meta_description: string
  published_at: string
}

const blankForm: FormState = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author_name: '',
  category: 'AI News',
  tags: '',
  status: 'published',
  featured: false,
  featured_image_url: '',
  estimated_read_time: 5,
  meta_description: '',
  published_at: new Date().toISOString().slice(0, 10),
}

const BlogsManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(blankForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      const resp = await getBlogPosts({ pageSize: 100 })
      setPosts(resp.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const edit = (post: BlogPost) => {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author_name: post.author_name,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      featured: post.featured,
      featured_image_url: post.featured_image_url || '',
      estimated_read_time: post.estimated_read_time,
      meta_description: post.meta_description || '',
      published_at: (post.published_at || post.created_at).slice(0, 10),
    })
  }

  const reset = () => {
    setForm(blankForm)
    setMessage(null)
    setError(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadFile('image', file)
      setForm((f) => ({ ...f, featured_image_url: result.url }))
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
      const payload: Partial<BlogPost> = {
        title: form.title,
        slug: form.slug || undefined,
        content: form.content,
        excerpt: form.excerpt,
        author_name: form.author_name,
        category: form.category,
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        status: form.status,
        featured: form.featured,
        featured_image_url: form.featured_image_url || null,
        estimated_read_time: form.estimated_read_time,
        meta_description: form.meta_description || null,
        published_at: form.published_at,
      }

      if (form.id) {
        await updateBlogPost(form.id, payload)
        setMessage('Blog post updated.')
      } else {
        await createBlogPost(payload)
        setMessage('Blog post created.')
      }
      reset()
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return
    try {
      await deleteBlogPost(id)
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={save} className="bg-navy-light border border-purple/30 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">{form.id ? 'Edit Blog Post' : 'New Blog Post'}</h2>

          <Field label="Title"><input className="input" value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Slug (optional — auto-generated from title)"><input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Author"><input className="input" value={form.author_name} required onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></Field>
          <Field label="Excerpt"><textarea className="input h-20" value={form.excerpt} required onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></Field>
          <Field label="Content (Markdown or HTML)"><textarea className="input h-48" value={form.content} required onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
            <Field label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </Field>
          </div>

          <Field label="Tags (comma-separated)"><input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Read time (min)"><input type="number" className="input" value={form.estimated_read_time} onChange={(e) => setForm({ ...form, estimated_read_time: Number(e.target.value) })} /></Field>
            <Field label="Publish date"><input type="date" className="input" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></Field>
          </div>

          <Field label="Featured image">
            <div className="flex gap-2 items-center">
              <input className="input flex-1" value={form.featured_image_url} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} />
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </Field>

          <Field label="Meta description"><textarea className="input h-16" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} /></Field>

          <div className="flex items-center gap-2">
            <input id="blogfeat" type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <label htmlFor="blogfeat" className="text-sm text-gray-300">Featured post</label>
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
            <h2 className="text-xl font-bold">Blog posts ({posts.length})</h2>
            <button onClick={reset} className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> New</button>
          </div>
          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="text-gray-400">No posts yet.</div>
          ) : (
            <ul className="space-y-2 max-h-[640px] overflow-y-auto">
              {posts.map((p) => (
                <li key={p.id} className="p-3 bg-navy rounded border border-purple/20 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-gray-400">{p.category} · {p.status} · {p.author_name}</div>
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

export default BlogsManager
