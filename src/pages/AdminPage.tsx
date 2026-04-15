import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  FileText, Settings, Plus, Save, Trash2, Edit, 
  Copy, Download, RefreshCw, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, BookOpen, Image, Check, X
} from 'lucide-react'
import {
  createArticle,
  deleteArticle as removeArticle,
  getAdminSettings as requestAdminSettings,
  generateArticle as requestArticleGeneration,
  generateArticleImage,
  getAdminPassword,
  generateImagePrompts as requestImagePrompts,
  getArticles,
  setAdminPassword,
  updateAdminSettings as saveAdminSettings,
  updateArticle,
  verifyAdminPassword,
  type AdminSettings,
} from '../lib/api'
import { parseArticleContent } from '../lib/articleContent'

// Types
interface PromptTemplate {
  id: string
  name: string
  topic: string
  word_count: number
  style: string
  created_at: string
}

interface AdminArticle {
  id: string
  headline: string
  content: string
  summary: string
  category: string
  tags: string[]
  status: string
  published_at?: string | null
  created_at: string
  image_url?: string
  image_prompt?: string
  hero_image_url?: string
  inline_image_url?: string
  hero_image_prompt?: string
  inline_image_prompt?: string
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingStoredAuth, setCheckingStoredAuth] = useState(true)
  const [authenticating, setAuthenticating] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Article Generator State
  const [topic, setTopic] = useState('')
  const [wordCount, setWordCount] = useState(750)
  const [style, setStyle] = useState<'Professional' | 'Casual' | 'Technical'>('Professional')
  const [generatedArticle, setGeneratedArticle] = useState('')
  const [generatedHeadline, setGeneratedHeadline] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null)
  const [savingArticle, setSavingArticle] = useState(false)
  const [articleSaveMessage, setArticleSaveMessage] = useState('')
  
  // Image Prompt Generation State
  const [showImagePromptsSection, setShowImagePromptsSection] = useState(false)
  const [heroPrompt, setHeroPrompt] = useState('')
  const [inlinePrompt, setInlinePrompt] = useState('')
  const [promptsReviewed, setPromptsReviewed] = useState(false)
  const [generatingPrompts, setGeneratingPrompts] = useState(false)
  const [generatingImages, setGeneratingImages] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [inlineImageUrl, setInlineImageUrl] = useState<string | null>(null)
  const [heroImageApproved, setHeroImageApproved] = useState(false)
  const [inlineImageApproved, setInlineImageApproved] = useState(false)
  const [imageError, setImageError] = useState('')
  const [savingApprovedImages, setSavingApprovedImages] = useState(false)
  
  // Articles State
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<AdminArticle | null>(null)
  
  // Edit Article State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    headline: '',
    content: '',
    summary: '',
    category: 'AI',
    tags: ''
  })
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  
  // Prompt Templates State
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null)
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null)
  const [settingsForm, setSettingsForm] = useState({
    openaiApiKey: '',
    openaiTextModel: 'gpt-4o-mini',
    openaiImageModel: 'gpt-image-1',
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const articleSaveRequestRef = useRef<Promise<string> | null>(null)

  // Tab state
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'articles' | 'settings'>('generator')

  // Auth handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthenticating(true)
    setAuthError('')

    try {
      await verifyAdminPassword(password)
      setAdminPassword(password)
      setIsAuthenticated(true)
    } catch (error) {
      setAdminPassword(null)
      setIsAuthenticated(false)
      setAuthError(error instanceof Error ? error.message : 'Invalid password')
    } finally {
      setAuthenticating(false)
    }
  }

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const data = await getArticles({
        sort: 'created_at',
        order: 'desc',
        limit: 50,
      })
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoadingArticles(false)
    }
  }

  // Fetch templates (stored in localStorage for now - could move to DB)
  const fetchTemplates = () => {
    const saved = localStorage.getItem('admin_prompt_templates')
    if (saved) {
      setTemplates(JSON.parse(saved))
    }
  }

  const fetchAdminSettings = async () => {
    setLoadingSettings(true)
    setSettingsError('')

    try {
      const settings = await requestAdminSettings()
      setAdminSettings(settings)
      setSettingsForm({
        openaiApiKey: '',
        openaiTextModel: settings.openaiTextModel,
        openaiImageModel: settings.openaiImageModel,
      })
    } catch (error) {
      console.error('Error fetching admin settings:', error)
      setSettingsError('Failed to load admin settings')
    } finally {
      setLoadingSettings(false)
    }
  }

  // Save template
  const saveTemplate = () => {
    if (!templateName.trim()) return
    
    const newTemplate: PromptTemplate = {
      id: editingTemplate?.id || crypto.randomUUID(),
      name: templateName,
      topic,
      word_count: wordCount,
      style,
      created_at: new Date().toISOString()
    }
    
    let updatedTemplates: PromptTemplate[]
    if (editingTemplate) {
      updatedTemplates = templates.map(t => t.id === editingTemplate.id ? newTemplate : t)
    } else {
      updatedTemplates = [...templates, newTemplate]
    }
    
    localStorage.setItem('admin_prompt_templates', JSON.stringify(updatedTemplates))
    setTemplates(updatedTemplates)
    setShowTemplateModal(false)
    setTemplateName('')
    setEditingTemplate(null)
  }

  // Delete template
  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id)
    localStorage.setItem('admin_prompt_templates', JSON.stringify(updated))
    setTemplates(updated)
  }

  // Load template
  const loadTemplate = (template: PromptTemplate) => {
    setTopic(template.topic)
    setWordCount(template.word_count)
    setStyle(template.style as 'Professional' | 'Casual' | 'Technical')
    setActiveTab('generator')
  }

  // Generate article through the local API
  const generateArticle = async () => {
    if (!topic.trim()) {
      setGenerationError('Please enter a topic or news source')
      return
    }

    setGenerating(true)
    setGenerationError('')
    setGeneratedArticle('')
    setGeneratedHeadline('')
    setSelectedArticle(null)
    setSavedArticleId(null)
    articleSaveRequestRef.current = null
    setArticleSaveMessage('')
    setShowImagePromptsSection(false)
    setHeroPrompt('')
    setInlinePrompt('')
    setHeroImageUrl(null)
    setInlineImageUrl(null)
    setHeroImageApproved(false)
    setInlineImageApproved(false)
    setImageError('')

    try {
      const data = await requestArticleGeneration({
        topic,
        word_count: wordCount,
        style,
      })

      const nextHeadline = data.headline || topic.substring(0, 60)
      const nextContent = data.content || JSON.stringify(data)

      setGeneratedHeadline(nextHeadline)
      setGeneratedArticle(nextContent)
      setShowImagePromptsSection(true)
      void generateImagePrompts(nextContent, nextHeadline)
    } catch (error) {
      console.error('Generation error:', error)
      setGenerationError('Failed to generate article. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const buildGeneratedArticleData = () => ({
    headline: generatedHeadline || topic.substring(0, 60),
    content: generatedArticle,
    summary: generatedArticle.substring(0, 200) + '...',
    category: 'AI',
    tags: ['generated', 'airab-money'],
    status: 'published',
    published_at: new Date().toISOString(),
  })

  const persistGeneratedArticle = async () => {
    if (savedArticleId) {
      return savedArticleId
    }

    if (articleSaveRequestRef.current) {
      return articleSaveRequestRef.current
    }

    const request = (async () => {
      const createdArticle = await createArticle(buildGeneratedArticleData())
      setSavedArticleId(createdArticle.id)
      fetchArticles()
      return createdArticle.id
    })()

    articleSaveRequestRef.current = request

    try {
      return await request
    } finally {
      articleSaveRequestRef.current = null
    }
  }

  // Save article to database
  const saveArticle = async () => {
    if (!generatedArticle.trim() || savingArticle) return

    const alreadySaved = Boolean(savedArticleId)
    setSavingArticle(true)
    setGenerationError('')
    setArticleSaveMessage(alreadySaved ? 'Article already saved.' : 'Saving article...')

    try {
      await persistGeneratedArticle()
      setArticleSaveMessage(alreadySaved ? 'Article already saved.' : 'Article saved successfully.')
      setShowImagePromptsSection(true)
    } catch (error) {
      console.error('Error saving article:', error)
      setGenerationError('Failed to save article')
      setArticleSaveMessage('')
    } finally {
      setSavingArticle(false)
    }
  }

  // Generate image prompts from article content
  const generateImagePrompts = async (contentOverride?: string, headlineOverride?: string) => {
    const articleContent = contentOverride ?? generatedArticle
    const promptHeadline = headlineOverride ?? generatedHeadline ?? topic.substring(0, 60)

    if (!articleContent || !promptHeadline) return

    setShowImagePromptsSection(true)
    setGeneratingPrompts(true)
    setImageError('')

    try {
      const data = await requestImagePrompts({
        content: articleContent,
        headline: promptHeadline,
      })
      
      if (data) {
        const nextHeroPrompt = data.hero_prompt || ''
        const nextInlinePrompt = data.inline_prompt || ''

        setHeroPrompt(nextHeroPrompt)
        setInlinePrompt(nextInlinePrompt)
        setPromptsReviewed(true)
        setHeroImageUrl(null)
        setInlineImageUrl(null)
        setHeroImageApproved(false)
        setInlineImageApproved(false)

        if (nextHeroPrompt && nextInlinePrompt) {
          void generateImagesForPrompts(nextHeroPrompt, nextInlinePrompt)
        }
      }
    } catch (error) {
      console.error('Error generating prompts:', error)
      setImageError('Failed to generate image prompts. Please try again.')
    } finally {
      setGeneratingPrompts(false)
    }
  }

  // Generate images from prompts
  const generateImagesForPrompts = async (heroPromptValue: string, inlinePromptValue: string) => {
    setGeneratingImages(true)
    setImageError('')

    try {
      const heroData = await generateArticleImage({
        prompt: heroPromptValue,
        imageType: 'hero',
      })
      if (heroData.imageUrl) {
        setHeroImageUrl(heroData.imageUrl)
      }

      const inlineData = await generateArticleImage({
        prompt: inlinePromptValue,
        imageType: 'inline',
      })
      if (inlineData.imageUrl) {
        setInlineImageUrl(inlineData.imageUrl)
      }
    } catch (error) {
      console.error('Error generating images:', error)
      setImageError('Failed to generate images. Please try again.')
    } finally {
      setGeneratingImages(false)
    }
  }

  const generateImages = async () => {
    if (!heroPrompt || !inlinePrompt) return

    await generateImagesForPrompts(heroPrompt, inlinePrompt)
  }

  // Regenerate single image
  const regenerateImage = async (type: 'hero' | 'inline') => {
    const prompt = type === 'hero' ? heroPrompt : inlinePrompt
    if (!prompt) return

    setGeneratingImages(true)
    setImageError('')

    try {
      const data = await generateArticleImage({
        prompt,
        imageType: type,
      })
      if (data.imageUrl) {
        if (type === 'hero') {
          setHeroImageUrl(data.imageUrl)
          setHeroImageApproved(false)
        } else {
          setInlineImageUrl(data.imageUrl)
          setInlineImageApproved(false)
        }
      }
    } catch (error) {
      console.error('Error regenerating image:', error)
      setImageError(`Failed to regenerate ${type} image. Please try again.`)
    } finally {
      setGeneratingImages(false)
    }
  }

  // Save approved images to article
  const saveImagesToArticle = async () => {
    if (savingApprovedImages) return

    setSavingApprovedImages(true)
    setImageError('')

    try {
      const articleId = await persistGeneratedArticle()
      const updateData: Record<string, any> = {}
      
      if (heroImageApproved && heroImageUrl) {
        updateData.hero_image_url = heroImageUrl
        updateData.hero_image_prompt = heroPrompt
      }
      if (inlineImageApproved && inlineImageUrl) {
        updateData.inline_image_url = inlineImageUrl
        updateData.inline_image_prompt = inlinePrompt
      }

      if (Object.keys(updateData).length === 0) return

      await updateArticle(articleId, updateData)

      // Clear form
      setGeneratedArticle('')
      setGeneratedHeadline('')
      setSelectedArticle(null)
      setTopic('')
      setArticleSaveMessage('')
      setShowImagePromptsSection(false)
      setHeroPrompt('')
      setInlinePrompt('')
      setHeroImageUrl(null)
      setInlineImageUrl(null)
      setHeroImageApproved(false)
      setInlineImageApproved(false)
      setSavedArticleId(null)
      
      // Refresh articles list
      fetchArticles()
      setActiveTab('articles')
    } catch (error) {
      console.error('Error saving images:', error)
      setImageError('Failed to save images to article')
    } finally {
      setSavingApprovedImages(false)
    }
  }

  // Delete article
  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await removeArticle(id)
      fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  // Start editing article
  const startEditArticle = (article: AdminArticle) => {
    setEditingArticleId(article.id)
    setEditFormData({
      headline: article.headline,
      content: article.content,
      summary: article.summary,
      category: article.category,
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : ''
    })
    setEditError('')
  }

  const loadArticleIntoImageStudio = (article: AdminArticle) => {
    const heroPromptValue = article.hero_image_prompt || article.image_prompt || ''
    const heroImageValue = article.hero_image_url || article.image_url || null

    setSelectedArticle(article)
    setActiveTab('generator')
    setTopic(article.headline)
    setGeneratedHeadline(article.headline)
    setGeneratedArticle(article.content)
    setSavedArticleId(article.id)
    articleSaveRequestRef.current = null
    setArticleSaveMessage('Loaded article from archive for image work.')
    setGenerationError('')
    setImageError('')
    setShowImagePromptsSection(true)
    setHeroPrompt(heroPromptValue)
    setInlinePrompt(article.inline_image_prompt || '')
    setPromptsReviewed(Boolean(heroPromptValue || article.inline_image_prompt))
    setHeroImageUrl(heroImageValue)
    setInlineImageUrl(article.inline_image_url || null)
    setHeroImageApproved(Boolean(heroImageValue))
    setInlineImageApproved(Boolean(article.inline_image_url))
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingArticleId(null)
    setEditFormData({
      headline: '',
      content: '',
      summary: '',
      category: 'AI',
      tags: ''
    })
    setEditError('')
  }

  // Save article edits
  const saveArticleEdit = async () => {
    if (!editingArticleId) return

    if (!editFormData.headline.trim() || !editFormData.content.trim()) {
      setEditError('Headline and content are required')
      return
    }

    setSavingEdit(true)
    setEditError('')

    try {
      const tagsArray = editFormData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      await updateArticle(editingArticleId, {
          headline: editFormData.headline,
          content: editFormData.content,
          summary: editFormData.summary || editFormData.content.substring(0, 200) + '...',
          category: editFormData.category,
          tags: tagsArray,
        })

      // Refresh articles and close edit mode
      fetchArticles()
      setEditingArticleId(null)
      setEditFormData({
        headline: '',
        content: '',
        summary: '',
        category: 'AI',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving article edit:', error)
      setEditError('Failed to save changes')
    } finally {
      setSavingEdit(false)
    }
  }

  const saveSettings = async () => {
    setSavingSettings(true)
    setSettingsError('')
    setSettingsMessage('')

    try {
      const payload: {
        openaiApiKey?: string | null
        openaiTextModel?: string | null
        openaiImageModel?: string | null
      } = {
        openaiTextModel: settingsForm.openaiTextModel.trim() || null,
        openaiImageModel: settingsForm.openaiImageModel.trim() || null,
      }

      if (settingsForm.openaiApiKey.trim()) {
        payload.openaiApiKey = settingsForm.openaiApiKey.trim()
      }

      const settings = await saveAdminSettings(payload)
      setAdminSettings(settings)
      setSettingsForm({
        openaiApiKey: '',
        openaiTextModel: settings.openaiTextModel,
        openaiImageModel: settings.openaiImageModel,
      })
      setSettingsMessage(
        payload.openaiApiKey
          ? 'Settings saved. OpenAI key and model defaults updated.'
          : 'Settings saved.',
      )
    } catch (error) {
      console.error('Error saving admin settings:', error)
      setSettingsError('Failed to save admin settings')
    } finally {
      setSavingSettings(false)
    }
  }

  const clearStoredApiKey = async () => {
    setSavingSettings(true)
    setSettingsError('')
    setSettingsMessage('')

    try {
      const settings = await saveAdminSettings({ openaiApiKey: null })
      setAdminSettings(settings)
      setSettingsForm((current) => ({
        ...current,
        openaiApiKey: '',
      }))
      setSettingsMessage(
        settings.openaiApiKeySource === 'environment'
          ? 'Stored API key cleared. The server is now using the environment key.'
          : 'Stored API key cleared.',
      )
    } catch (error) {
      console.error('Error clearing stored API key:', error)
      setSettingsError('Failed to clear stored API key')
    } finally {
      setSavingSettings(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    const storedPassword = getAdminPassword()

    if (!storedPassword) {
      setCheckingStoredAuth(false)
      return
    }

    const restoreAuth = async () => {
      try {
        await verifyAdminPassword(storedPassword)
        setPassword(storedPassword)
        setIsAuthenticated(true)
        setAuthError('')
      } catch {
        setAdminPassword(null)
        setPassword('')
        setIsAuthenticated(false)
      } finally {
        setCheckingStoredAuth(false)
      }
    }

    restoreAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles()
      fetchTemplates()
      fetchAdminSettings()
    }
  }, [isAuthenticated])

  const hasImagePrompts = Boolean(heroPrompt || inlinePrompt)
  const hasGeneratedImages = Boolean(heroImageUrl || inlineImageUrl)
  const hasApprovedImages = heroImageApproved || inlineImageApproved
  const articlePreviewBlocks = useMemo(() => parseArticleContent(generatedArticle), [generatedArticle])

  const renderImagePipeline = () => {
    if (!showImagePromptsSection) return null

    return (
      <div className="rounded-xl border border-white/5 bg-charcoal p-5 space-y-5">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-dusk-rose/80">Visual Pipeline</p>
            <h3 className="mt-2 text-lg font-heading font-bold text-off-white">Article image generation</h3>
            <p className="mt-2 text-sm text-brushed-silver">
              The desk drafts a hero visual and an inline scene from the finished article, then you review,
              render, approve, and save them back to the story.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-white/5 bg-graphite px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">Prompts</p>
              <p className="mt-2 text-sm font-semibold text-off-white">
                {generatingPrompts ? 'Generating' : hasImagePrompts ? 'Ready' : 'Queued'}
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-graphite px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">Images</p>
              <p className="mt-2 text-sm font-semibold text-off-white">
                {generatingImages ? 'Rendering' : hasGeneratedImages ? 'Ready' : 'Waiting'}
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-graphite px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">Article Link</p>
              <p className="mt-2 text-sm font-semibold text-off-white">
                {savedArticleId ? (hasApprovedImages ? 'Ready to save' : 'Saved') : 'Unsaved'}
              </p>
            </div>
          </div>
        </div>

        {imageError && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {imageError}
          </div>
        )}

        {!hasImagePrompts && !generatingPrompts && (
          <div className="rounded-lg border border-dashed border-white/10 bg-graphite/70 p-4 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-off-white">Prompt drafting is queued.</p>
              <p className="mt-1 text-sm text-brushed-silver">
                Generate prompts from the current article to start the visual review step.
              </p>
            </div>
            <button
              onClick={() => generateImagePrompts()}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-dusk-rose to-brushed-silver px-4 py-3 text-sm font-semibold text-off-white hover:opacity-90"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Prompts
            </button>
          </div>
        )}

        {generatingPrompts && (
          <div className="rounded-lg border border-white/5 bg-graphite/70 px-4 py-5 text-sm text-brushed-silver flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Drafting hero and inline image prompts from the article body...
          </div>
        )}

        {hasImagePrompts && !generatingPrompts && (
          <div className="space-y-5">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-dusk-rose">Hero Image Prompt</label>
                  <span className="text-xs uppercase tracking-[0.22em] text-brushed-silver/70">Opening frame</span>
                </div>
                <textarea
                  value={heroPrompt}
                  onChange={(e) => {
                    setHeroPrompt(e.target.value)
                    setPromptsReviewed(false)
                  }}
                  className="h-32 w-full resize-none rounded-lg border border-white/5 bg-graphite px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                  placeholder="Hero image prompt will appear here..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-brushed-silver">Inline Image Prompt</label>
                  <span className="text-xs uppercase tracking-[0.22em] text-brushed-silver/70">Supporting visual</span>
                </div>
                <textarea
                  value={inlinePrompt}
                  onChange={(e) => {
                    setInlinePrompt(e.target.value)
                    setPromptsReviewed(false)
                  }}
                  className="h-32 w-full resize-none rounded-lg border border-white/5 bg-graphite px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                  placeholder="Inline image prompt will appear here..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setPromptsReviewed((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  promptsReviewed ? 'bg-green-500/20 text-green-400' : 'bg-graphite text-brushed-silver hover:text-off-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {promptsReviewed ? 'Prompts Reviewed' : 'Mark Prompts Reviewed'}
              </button>
              <button
                onClick={generateImages}
                disabled={!heroPrompt || !inlinePrompt || generatingImages}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-dusk-rose to-brushed-silver px-4 py-2 text-sm font-semibold text-off-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingImages ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Images...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    Generate Images
                  </>
                )}
              </button>
              <button
                onClick={() => generateImagePrompts()}
                className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-graphite px-4 py-2 text-sm text-brushed-silver hover:text-off-white"
                title="Refresh prompts"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Prompts
              </button>
            </div>

            {(hasGeneratedImages || generatingImages) && (
              <div className="grid grid-cols-1 gap-6 border-t border-white/5 pt-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-dusk-rose">Hero Image</h4>
                    {heroImageApproved ? (
                      <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">Approved</span>
                    ) : null}
                  </div>
                  {heroImageUrl ? (
                    <div className="relative overflow-hidden rounded-lg border border-white/5 bg-graphite">
                      <img src={heroImageUrl} alt="Hero" className="h-56 w-full object-cover" />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <button
                          onClick={() => regenerateImage('hero')}
                          disabled={generatingImages}
                          className="rounded-lg bg-charcoal/85 p-2 text-brushed-silver hover:text-off-white transition-colors disabled:opacity-50"
                          title="Regenerate hero image"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setHeroImageApproved(!heroImageApproved)}
                          className={`rounded-lg p-2 transition-colors ${
                            heroImageApproved
                              ? 'bg-green-500 text-off-white'
                              : 'bg-charcoal/85 text-brushed-silver hover:text-off-white'
                          }`}
                          title={heroImageApproved ? 'Approved' : 'Approve hero image'}
                        >
                          {heroImageApproved ? <Check className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-lg border border-white/5 bg-graphite text-brushed-silver">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-brushed-silver">Inline Image</h4>
                    {inlineImageApproved ? (
                      <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">Approved</span>
                    ) : null}
                  </div>
                  {inlineImageUrl ? (
                    <div className="relative overflow-hidden rounded-lg border border-white/5 bg-graphite">
                      <img src={inlineImageUrl} alt="Inline" className="h-56 w-full object-cover" />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <button
                          onClick={() => regenerateImage('inline')}
                          disabled={generatingImages}
                          className="rounded-lg bg-charcoal/85 p-2 text-brushed-silver hover:text-off-white transition-colors disabled:opacity-50"
                          title="Regenerate inline image"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setInlineImageApproved(!inlineImageApproved)}
                          className={`rounded-lg p-2 transition-colors ${
                            inlineImageApproved
                              ? 'bg-green-500 text-off-white'
                              : 'bg-charcoal/85 text-brushed-silver hover:text-off-white'
                          }`}
                          title={inlineImageApproved ? 'Approved' : 'Approve inline image'}
                        >
                          {inlineImageApproved ? <Check className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-lg border border-white/5 bg-graphite text-brushed-silver">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasApprovedImages ? (
              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  onClick={saveImagesToArticle}
                  disabled={savingApprovedImages}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingApprovedImages ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving Images...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Approved Images
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  // Auth form
  if (checkingStoredAuth) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center p-4">
        <Helmet>
          <title>Admin Login - AIRAB Money</title>
        </Helmet>
        <div className="bg-charcoal border border-white/5 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-dusk-rose to-brushed-silver rounded-full mx-auto mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 text-off-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-off-white">Admin Access</h1>
          <p className="text-brushed-silver mt-2">Checking saved admin session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center p-4">
        <Helmet>
          <title>Admin Login - AIRAB Money</title>
        </Helmet>
        <div className="bg-charcoal border border-white/5 rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-dusk-rose to-brushed-silver rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings className="w-8 h-8 text-off-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-off-white">Admin Access</h1>
            <p className="text-brushed-silver mt-2">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-sm text-brushed-silver mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                placeholder="Enter admin password"
              />
            </div>
            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}
            <button
              type="submit"
              disabled={authenticating}
              className="w-full bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {authenticating ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite">
      <Helmet>
        <title>Admin Dashboard - AIRAB Money</title>
      </Helmet>
      
      {/* Header */}
      <div className="bg-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-dusk-rose to-brushed-silver rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-off-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-off-white">Admin Dashboard</h1>
                <p className="text-brushed-silver text-sm">AIRAB Money Content Management</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAdminPassword(null)
                setIsAuthenticated(false)
                setPassword('')
                setAuthError('')
              }}
              className="text-brushed-silver hover:text-off-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white'
                : 'bg-charcoal text-brushed-silver hover:text-off-white'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Article Generator
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white'
                : 'bg-charcoal text-brushed-silver hover:text-off-white'
            }`}
          >
            <BookOpen className="w-5 h-5 inline-block mr-2" />
            Prompt Templates
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white'
                : 'bg-charcoal text-brushed-silver hover:text-off-white'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Articles
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white'
                : 'bg-charcoal text-brushed-silver hover:text-off-white'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Settings
          </button>
        </div>

        {/* Article Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {selectedArticle && (
              <div className="rounded-xl border border-dusk-rose/30 bg-charcoal p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-dusk-rose/80">
                      Archive Image Studio
                    </p>
                    <h2 className="mt-2 text-lg font-heading font-bold text-off-white">
                      Working from a published article
                    </h2>
                    <p className="mt-1 text-sm text-brushed-silver">
                      {selectedArticle.headline}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArticle(null)
                      setSavedArticleId(null)
                      setArticleSaveMessage('')
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-graphite px-4 py-2 text-sm text-brushed-silver hover:text-off-white"
                  >
                    <X className="w-4 h-4" />
                    Detach Archive Article
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
              <div className="space-y-6">
                <div className="bg-charcoal border border-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-heading font-bold text-off-white mb-6">Generate New Article</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-brushed-silver mb-2">News Source / Topic</label>
                      <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose h-32 resize-none"
                        placeholder="Enter a topic, news headline, or paste article content to summarize..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-brushed-silver mb-2">Word Count: {wordCount} words</label>
                      <input
                        type="range"
                        min="450"
                        max="1000"
                        step="50"
                        value={wordCount}
                        onChange={(e) => setWordCount(Number(e.target.value))}
                        className="w-full h-2 bg-graphite rounded-lg appearance-none cursor-pointer accent-dusk-rose"
                      />
                      <div className="flex justify-between text-xs text-brushed-silver mt-1">
                        <span>450</span>
                        <span>1000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-brushed-silver mb-2">Style / Tone</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Professional', 'Casual', 'Technical'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setStyle(s)}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${
                              style === s
                                ? 'bg-dusk-rose text-off-white'
                                : 'bg-graphite text-brushed-silver hover:text-off-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={generateArticle}
                        disabled={generating}
                        className="flex-1 bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {generating ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" />
                            Generate Article
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        className="px-4 py-3 bg-graphite border border-white/5 rounded-lg text-brushed-silver hover:text-off-white transition-colors"
                        title="Save as template"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    </div>

                    {generationError && (
                      <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {generationError}
                      </div>
                    )}
                  </div>
                </div>

                {renderImagePipeline()}
              </div>

              <div className="bg-charcoal border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading font-bold text-off-white">Generated Article</h2>
                  {generatedArticle && (
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => copyToClipboard(generatedHeadline + '\n\n' + generatedArticle)}
                        className="p-2 bg-graphite rounded-lg text-brushed-silver hover:text-off-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={saveArticle}
                        disabled={savingArticle || Boolean(savedArticleId)}
                        className="flex items-center gap-2 px-4 py-2 bg-graphite rounded-lg text-green-400 hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={savedArticleId ? 'Article already saved' : 'Save to database'}
                      >
                        {savingArticle ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : savedArticleId ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Article
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {generatedArticle ? (
                  <div className="space-y-4">
                    <div className="bg-graphite rounded-lg p-4">
                      <h3 className="text-lg font-bold text-off-white mb-2">{generatedHeadline}</h3>
                      <div className="space-y-4">
                        {articlePreviewBlocks.map((block, index) =>
                          block.type === 'heading' ? (
                            <h4
                              key={`preview-heading-${index}`}
                              className="pt-2 font-serif text-xl tracking-[-0.03em] text-off-white"
                            >
                              {block.content}
                            </h4>
                          ) : (
                            <p key={`preview-paragraph-${index}`} className="text-gray-300">
                              {block.content}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-5 h-5" />
                      Article generated successfully
                    </div>
                    {articleSaveMessage && (
                      <div className="flex items-center gap-2 text-brushed-silver text-sm">
                        {savingArticle ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {articleSaveMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-graphite rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-brushed-silver mx-auto mb-4" />
                    <p className="text-brushed-silver">Generated article will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-charcoal border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-off-white">Prompt Templates</h2>
              <button
                onClick={() => {
                  setEditingTemplate(null)
                  setTemplateName('')
                  setShowTemplateModal(true)
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Plus className="w-5 h-5" />
                New Template
              </button>
            </div>

            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-graphite border border-white/5 rounded-lg p-4 hover:border-dusk-rose/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-off-white">{template.name}</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadTemplate(template)}
                          className="p-1 text-brushed-silver hover:text-off-white"
                          title="Load template"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-1 text-brushed-silver hover:text-red-400"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-brushed-silver text-sm mb-2 line-clamp-2">{template.topic}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-dusk-rose/20 text-dusk-rose px-2 py-1 rounded">
                        {template.word_count} words
                      </span>
                      <span className="bg-cyan/20 text-brushed-silver px-2 py-1 rounded">
                        {template.style}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-brushed-silver mx-auto mb-4" />
                <p className="text-brushed-silver">No templates saved yet</p>
              </div>
            )}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-charcoal border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-off-white">All Articles</h2>
              <button
                onClick={fetchArticles}
                className="flex items-center gap-2 text-brushed-silver hover:text-off-white"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>

            {loadingArticles ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-dusk-rose animate-spin mx-auto mb-4" />
                <p className="text-brushed-silver">Loading articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-graphite border border-white/5 rounded-lg p-4 hover:border-dusk-rose/50 transition-colors"
                  >
                    {editingArticleId === article.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-brushed-silver mb-2">Headline</label>
                          <input
                            type="text"
                            value={editFormData.headline}
                            onChange={(e) => setEditFormData({...editFormData, headline: e.target.value})}
                            className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-2 text-off-white focus:outline-none focus:border-dusk-rose"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-brushed-silver mb-2">Content</label>
                          <textarea
                            value={editFormData.content}
                            onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                            className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-2 text-off-white focus:outline-none focus:border-dusk-rose h-64 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-brushed-silver mb-2">Summary</label>
                          <textarea
                            value={editFormData.summary}
                            onChange={(e) => setEditFormData({...editFormData, summary: e.target.value})}
                            className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-2 text-off-white focus:outline-none focus:border-dusk-rose h-24 resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-brushed-silver mb-2">Category</label>
                            <select
                              value={editFormData.category}
                              onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                              className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-2 text-off-white focus:outline-none focus:border-dusk-rose"
                            >
                              <option value="AI">AI</option>
                              <option value="Finance">Finance</option>
                              <option value="Technology">Technology</option>
                              <option value="Business">Business</option>
                              <option value="Markets">Markets</option>
                              <option value="Startup">Startup</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-brushed-silver mb-2">Tags (comma separated)</label>
                            <input
                              type="text"
                              value={editFormData.tags}
                              onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                              className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-2 text-off-white focus:outline-none focus:border-dusk-rose"
                              placeholder="tag1, tag2, tag3"
                            />
                          </div>
                        </div>
                        {editError && (
                          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                            {editError}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={saveArticleEdit}
                            disabled={savingEdit}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-off-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {savingEdit ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-graphite text-brushed-silver hover:text-off-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Article Display
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-off-white mb-1">{article.headline}</h3>
                          <p className="text-brushed-silver text-sm mb-2 line-clamp-2">{article.summary}</p>
                          <div className="flex items-center gap-3 text-xs flex-wrap">
                            <span className="bg-dusk-rose/20 text-dusk-rose px-2 py-1 rounded">
                              {article.category}
                            </span>
                            {article.hero_image_url && (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Hero Image ✓
                              </span>
                            )}
                            {article.inline_image_url && (
                              <span className="bg-cyan/20 text-brushed-silver px-2 py-1 rounded">
                                Inline Image ✓
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded ${
                              article.status === 'published' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {article.status}
                            </span>
                            <span className="text-brushed-silver">
                              {new Date(article.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => loadArticleIntoImageStudio(article)}
                            className="p-2 text-brushed-silver hover:text-dusk-rose"
                            title="Open image studio"
                          >
                            <Image className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEditArticle(article)}
                            className="p-2 text-brushed-silver hover:text-dusk-rose"
                            title="Edit article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(article.content)}
                            className="p-2 text-brushed-silver hover:text-off-white"
                            title="Copy content"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 text-brushed-silver hover:text-red-400"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-brushed-silver mx-auto mb-4" />
                <p className="text-brushed-silver">No articles found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-charcoal border border-white/5 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-off-white">Runtime Settings</h2>
                  <p className="mt-2 text-sm text-brushed-silver max-w-2xl">
                    Store OpenAI credentials and model defaults for article, prompt, and image generation.
                    Changes apply to the admin generator immediately and do not require a redeploy.
                  </p>
                </div>
                <button
                  onClick={fetchAdminSettings}
                  className="inline-flex items-center gap-2 rounded-lg bg-graphite px-4 py-2 text-sm text-brushed-silver hover:text-off-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              {loadingSettings ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-dusk-rose animate-spin mx-auto mb-4" />
                  <p className="text-brushed-silver">Loading settings...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-white/5 bg-graphite p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">
                        API Key
                      </p>
                      <p className="mt-2 text-sm font-semibold text-off-white">
                        {adminSettings?.openaiApiKeyConfigured ? 'Configured' : 'Missing'}
                      </p>
                      <p className="mt-1 text-xs text-brushed-silver">
                        {adminSettings?.openaiApiKeyMasked || 'No OpenAI key available'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-graphite p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">
                        Key Source
                      </p>
                      <p className="mt-2 text-sm font-semibold text-off-white capitalize">
                        {adminSettings?.openaiApiKeySource || 'none'}
                      </p>
                      <p className="mt-1 text-xs text-brushed-silver">
                        Database values override environment defaults.
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-graphite p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-brushed-silver/70">
                        Active Models
                      </p>
                      <p className="mt-2 text-sm font-semibold text-off-white">
                        {adminSettings?.openaiTextModel || settingsForm.openaiTextModel}
                      </p>
                      <p className="mt-1 text-xs text-brushed-silver">
                        Images: {adminSettings?.openaiImageModel || settingsForm.openaiImageModel}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-brushed-silver mb-2">OpenAI API Key</label>
                        <input
                          type="password"
                          value={settingsForm.openaiApiKey}
                          onChange={(e) =>
                            setSettingsForm((current) => ({
                              ...current,
                              openaiApiKey: e.target.value,
                            }))
                          }
                          className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                          placeholder="Paste a new API key to replace the current one"
                        />
                        <p className="mt-2 text-xs text-brushed-silver/80">
                          Leave blank to keep the existing key. Use the clear action below to remove a stored key.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm text-brushed-silver mb-2">Text Model</label>
                        <input
                          type="text"
                          value={settingsForm.openaiTextModel}
                          onChange={(e) =>
                            setSettingsForm((current) => ({
                              ...current,
                              openaiTextModel: e.target.value,
                            }))
                          }
                          className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                          placeholder="gpt-4o-mini"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-brushed-silver mb-2">Image Model</label>
                        <input
                          type="text"
                          value={settingsForm.openaiImageModel}
                          onChange={(e) =>
                            setSettingsForm((current) => ({
                              ...current,
                              openaiImageModel: e.target.value,
                            }))
                          }
                          className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                          placeholder="gpt-image-1"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-graphite/70 p-5 space-y-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-dusk-rose/80">
                          Notes
                        </p>
                        <h3 className="mt-2 text-lg font-heading font-bold text-off-white">
                          How this runtime config behaves
                        </h3>
                      </div>
                      <p className="text-sm text-brushed-silver">
                        Saved settings are stored server-side and only exposed in masked form back to the admin.
                        If there is no stored key, the app falls back to the Railway environment variable.
                      </p>
                      <p className="text-sm text-brushed-silver">
                        Text model changes affect article generation and prompt generation. Image model changes affect
                        both new article renders and archived article image work.
                      </p>
                      <div className="rounded-lg border border-dashed border-white/10 bg-charcoal/80 p-4">
                        <p className="text-sm font-semibold text-off-white">Current key source</p>
                        <p className="mt-1 text-sm text-brushed-silver capitalize">
                          {adminSettings?.openaiApiKeySource || 'none'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {settingsError && (
                    <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {settingsError}
                    </div>
                  )}

                  {settingsMessage && (
                    <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {settingsMessage}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={saveSettings}
                      disabled={savingSettings}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-dusk-rose to-brushed-silver px-5 py-3 text-sm font-semibold text-off-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingSettings ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Settings
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearStoredApiKey}
                      disabled={savingSettings}
                      className="inline-flex items-center gap-2 rounded-lg bg-graphite px-5 py-3 text-sm text-brushed-silver hover:text-off-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Stored API Key
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-charcoal border border-white/5 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-heading font-bold text-off-white mb-4">
              {editingTemplate ? 'Edit Template' : 'Save as Template'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm text-brushed-silver mb-2">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-graphite border border-white/5 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-dusk-rose"
                placeholder="Enter a name for this template"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 bg-gradient-to-r from-dusk-rose to-brushed-silver text-off-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Save Template
              </button>
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  setEditingTemplate(null)
                  setTemplateName('')
                }}
                className="px-6 py-3 bg-graphite text-brushed-silver rounded-lg hover:text-off-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
