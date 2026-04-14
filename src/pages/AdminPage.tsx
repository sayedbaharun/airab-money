import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  FileText, Settings, Plus, Save, Trash2, Edit, 
  Copy, Download, RefreshCw, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, BookOpen, Image, Check, X
} from 'lucide-react'
import {
  createArticle,
  deleteArticle as removeArticle,
  generateArticle as requestArticleGeneration,
  generateArticleImage,
  getAdminPassword,
  generateImagePrompts as requestImagePrompts,
  getArticles,
  setAdminPassword,
  updateArticle,
  verifyAdminPassword,
} from '../lib/api'

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

  // Tab state
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'articles'>('generator')

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
    setSavedArticleId(null)
    setShowImagePromptsSection(false)
    setHeroPrompt('')
    setInlinePrompt('')
    setHeroImageUrl(null)
    setInlineImageUrl(null)
    setHeroImageApproved(false)
    setInlineImageApproved(false)

    try {
      const data = await requestArticleGeneration({
        topic,
        word_count: wordCount,
        style,
      })
      
      if (data.headline) {
        setGeneratedHeadline(data.headline)
      }
      if (data.content) {
        setGeneratedArticle(data.content)
      } else {
        setGeneratedArticle(JSON.stringify(data))
      }
    } catch (error) {
      console.error('Generation error:', error)
      setGenerationError('Failed to generate article. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Save article to database
  const saveArticle = async () => {
    if (!generatedArticle.trim()) return

    try {
      const articleData = {
        headline: generatedHeadline || topic.substring(0, 60),
        content: generatedArticle,
        summary: generatedArticle.substring(0, 200) + '...',
        category: 'AI',
        tags: ['generated', 'airab-money'],
        status: 'published',
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      const createdArticle = await createArticle(articleData)

      if (createdArticle) {
        setSavedArticleId(createdArticle.id)
      }
      
      // Show image prompts section after saving
      setShowImagePromptsSection(true)
    } catch (error) {
      console.error('Error saving article:', error)
      setGenerationError('Failed to save article')
    }
  }

  // Generate image prompts from article content
  const generateImagePrompts = async () => {
    if (!generatedArticle || !generatedHeadline) return

    setGeneratingPrompts(true)
    setImageError('')

    try {
      const data = await requestImagePrompts({
        content: generatedArticle,
        headline: generatedHeadline,
      })
      
      if (data) {
        setHeroPrompt(data.hero_prompt || '')
        setInlinePrompt(data.inline_prompt || '')
        setPromptsReviewed(false)
        setHeroImageUrl(null)
        setInlineImageUrl(null)
        setHeroImageApproved(false)
        setInlineImageApproved(false)
      }
    } catch (error) {
      console.error('Error generating prompts:', error)
      setImageError('Failed to generate image prompts. Please try again.')
    } finally {
      setGeneratingPrompts(false)
    }
  }

  // Generate images from prompts
  const generateImages = async () => {
    if (!heroPrompt || !inlinePrompt) return

    setGeneratingImages(true)
    setImageError('')

    try {
      const heroData = await generateArticleImage({
        prompt: heroPrompt,
        imageType: 'hero',
      })
      if (heroData.imageUrl) {
        setHeroImageUrl(heroData.imageUrl)
      }

      const inlineData = await generateArticleImage({
        prompt: inlinePrompt,
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
    if (!savedArticleId) return

    try {
      const updateData: Record<string, any> = {}
      
      if (heroImageApproved && heroImageUrl) {
        updateData.image_url = heroImageUrl
        updateData.image_prompt = heroPrompt
        updateData.hero_image_url = heroImageUrl
        updateData.hero_image_prompt = heroPrompt
      }
      if (inlineImageApproved && inlineImageUrl) {
        updateData.inline_image_url = inlineImageUrl
        updateData.inline_image_prompt = inlinePrompt
      }

      if (Object.keys(updateData).length === 0) return

      await updateArticle(savedArticleId, updateData)

      // Clear form
      setGeneratedArticle('')
      setGeneratedHeadline('')
      setTopic('')
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
    }
  }, [isAuthenticated])

  // Auth form
  if (checkingStoredAuth) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <Helmet>
          <title>Admin Login - AIRAB Money</title>
        </Helmet>
        <div className="bg-navy-light border border-purple/30 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple to-cyan rounded-full mx-auto mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Checking saved admin session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <Helmet>
          <title>Admin Login - AIRAB Money</title>
        </Helmet>
        <div className="bg-navy-light border border-purple/30 rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple to-cyan rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Admin Access</h1>
            <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy border border-purple/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple"
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
              className="w-full bg-gradient-to-r from-purple to-cyan text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {authenticating ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <Helmet>
        <title>Admin Dashboard - AIRAB Money</title>
      </Helmet>
      
      {/* Header */}
      <div className="bg-navy-light border-b border-purple/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple to-cyan rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">AIRAB Money Content Management</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAdminPassword(null)
                setIsAuthenticated(false)
                setPassword('')
                setAuthError('')
              }}
              className="text-gray-400 hover:text-white text-sm"
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
                ? 'bg-gradient-to-r from-purple to-cyan text-white'
                : 'bg-navy-light text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Article Generator
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-purple to-cyan text-white'
                : 'bg-navy-light text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5 inline-block mr-2" />
            Prompt Templates
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-purple to-cyan text-white'
                : 'bg-navy-light text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Articles
          </button>
        </div>

        {/* Article Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
                <h2 className="text-xl font-heading font-bold text-white mb-6">Generate New Article</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">News Source / Topic</label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-navy border border-purple/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple h-32 resize-none"
                      placeholder="Enter a topic, news headline, or paste article content to summarize..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Word Count: {wordCount} words
                    </label>
                    <input
                      type="range"
                      min="450"
                      max="1000"
                      step="50"
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="w-full h-2 bg-navy rounded-lg appearance-none cursor-pointer accent-purple"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>450</span>
                      <span>1000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Style / Tone</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Professional', 'Casual', 'Technical'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStyle(s)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            style === s
                              ? 'bg-purple text-white'
                              : 'bg-navy text-gray-400 hover:text-white'
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
                      className="flex-1 bg-gradient-to-r from-purple to-cyan text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
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
                      className="px-4 py-3 bg-navy border border-purple/30 rounded-lg text-gray-400 hover:text-white transition-colors"
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

              {/* Output Section */}
              <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading font-bold text-white">Generated Article</h2>
                  {generatedArticle && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(generatedHeadline + '\n\n' + generatedArticle)}
                        className="p-2 bg-navy rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={saveArticle}
                        className="p-2 bg-navy rounded-lg text-green-400 hover:text-green-300 transition-colors"
                        title="Save to database"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {generatedArticle ? (
                  <div className="space-y-4">
                    <div className="bg-navy rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{generatedHeadline}</h3>
                      <div className="prose prose-invert max-w-none">
                        {generatedArticle.split('\n\n').map((para, i) => (
                          <p key={i} className="text-gray-300 mb-3">{para}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-5 h-5" />
                      Article generated successfully
                    </div>
                  </div>
                ) : (
                  <div className="bg-navy rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Generated article will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Prompts Section */}
            {showImagePromptsSection && generatedArticle && (
              <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <Image className="w-6 h-6" />
                    Generate Images
                  </h2>
                  {!heroPrompt && !generatingPrompts && (
                    <button
                      onClick={generateImagePrompts}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple to-cyan text-white px-4 py-2 rounded-lg hover:opacity-90"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Generate Prompts
                    </button>
                  )}
                </div>

                {generatingPrompts && (
                  <div className="flex items-center justify-center gap-3 py-8 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Generating image prompts from article content...</span>
                  </div>
                )}

                {heroPrompt && !generatingPrompts && (
                  <div className="space-y-6">
                    {/* Hero Prompt */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-purple">Hero Image Prompt</label>
                        <button
                          onClick={() => setPromptsReviewed(true)}
                          className={`text-xs px-3 py-1 rounded ${
                            promptsReviewed 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-navy text-gray-400 hover:text-white'
                          }`}
                        >
                          {promptsReviewed ? 'Reviewed ✓' : 'Mark as Reviewed'}
                        </button>
                      </div>
                      <textarea
                        value={heroPrompt}
                        onChange={(e) => {
                          setHeroPrompt(e.target.value)
                          setPromptsReviewed(false)
                        }}
                        className="w-full bg-navy border border-purple/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple h-32 resize-none"
                        placeholder="Hero image prompt will appear here..."
                      />
                    </div>

                    {/* Inline Prompt */}
                    <div>
                      <label className="text-sm font-semibold text-cyan block mb-2">Inline Image Prompt</label>
                      <textarea
                        value={inlinePrompt}
                        onChange={(e) => {
                          setInlinePrompt(e.target.value)
                          setPromptsReviewed(false)
                        }}
                        className="w-full bg-navy border border-cyan/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan h-32 resize-none"
                        placeholder="Inline image prompt will appear here..."
                      />
                    </div>

                    {/* Generate Images Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={generateImages}
                        disabled={!promptsReviewed || generatingImages}
                        className="flex-1 bg-gradient-to-r from-purple to-cyan text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingImages ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating Images...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Image className="w-5 h-5" />
                            Generate Images
                          </span>
                        )}
                      </button>
                      <button
                        onClick={generateImagePrompts}
                        className="px-4 py-3 bg-navy border border-purple/30 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Regenerate prompts"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>

                    {imageError && (
                      <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {imageError}
                      </div>
                    )}

                    {/* Generated Images */}
                    {(heroImageUrl || inlineImageUrl) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-purple/30">
                        {/* Hero Image */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-purple">Hero Image</h3>
                          {heroImageUrl ? (
                            <div className="relative">
                              <img
                                src={heroImageUrl}
                                alt="Hero"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  onClick={() => regenerateImage('hero')}
                                  disabled={generatingImages}
                                  className="p-2 bg-navy/80 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                  title="Regenerate"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-2 right-2 flex gap-2">
                                <button
                                  onClick={() => setHeroImageApproved(!heroImageApproved)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    heroImageApproved 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-navy/80 text-gray-400 hover:text-white'
                                  }`}
                                  title={heroImageApproved ? 'Approved' : 'Approve'}
                                >
                                  {heroImageApproved ? <Check className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              </div>
                              {heroImageApproved && (
                                <div className="absolute bottom-2 left-2">
                                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                    Approved ✓
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-navy rounded-lg flex items-center justify-center">
                              <RefreshCw className="w-8 h-8 text-gray-600 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Inline Image */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-cyan">Inline Image</h3>
                          {inlineImageUrl ? (
                            <div className="relative">
                              <img
                                src={inlineImageUrl}
                                alt="Inline"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  onClick={() => regenerateImage('inline')}
                                  disabled={generatingImages}
                                  className="p-2 bg-navy/80 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                  title="Regenerate"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-2 right-2 flex gap-2">
                                <button
                                  onClick={() => setInlineImageApproved(!inlineImageApproved)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    inlineImageApproved 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-navy/80 text-gray-400 hover:text-white'
                                  }`}
                                  title={inlineImageApproved ? 'Approved' : 'Approve'}
                                >
                                  {inlineImageApproved ? <Check className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              </div>
                              {inlineImageApproved && (
                                <div className="absolute bottom-2 left-2">
                                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                    Approved ✓
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-navy rounded-lg flex items-center justify-center">
                              <RefreshCw className="w-8 h-8 text-gray-600 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Save Images Button */}
                    {(heroImageApproved || inlineImageApproved) && (
                      <div className="flex justify-end pt-4 border-t border-purple/30">
                        <button
                          onClick={saveImagesToArticle}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                          <Save className="w-5 h-5" />
                          Save Approved Images
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Prompt Templates</h2>
              <button
                onClick={() => {
                  setEditingTemplate(null)
                  setTemplateName('')
                  setShowTemplateModal(true)
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple to-cyan text-white px-4 py-2 rounded-lg hover:opacity-90"
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
                    className="bg-navy border border-purple/30 rounded-lg p-4 hover:border-purple/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadTemplate(template)}
                          className="p-1 text-gray-400 hover:text-white"
                          title="Load template"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-400"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{template.topic}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-purple/20 text-purple px-2 py-1 rounded">
                        {template.word_count} words
                      </span>
                      <span className="bg-cyan/20 text-cyan px-2 py-1 rounded">
                        {template.style}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No templates saved yet</p>
              </div>
            )}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-navy-light border border-purple/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-white">All Articles</h2>
              <button
                onClick={fetchArticles}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>

            {loadingArticles ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-purple animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-navy border border-purple/30 rounded-lg p-4 hover:border-purple/50 transition-colors"
                  >
                    {editingArticleId === article.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Headline</label>
                          <input
                            type="text"
                            value={editFormData.headline}
                            onChange={(e) => setEditFormData({...editFormData, headline: e.target.value})}
                            className="w-full bg-navy-light border border-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Content</label>
                          <textarea
                            value={editFormData.content}
                            onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                            className="w-full bg-navy-light border border-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple h-64 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Summary</label>
                          <textarea
                            value={editFormData.summary}
                            onChange={(e) => setEditFormData({...editFormData, summary: e.target.value})}
                            className="w-full bg-navy-light border border-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple h-24 resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Category</label>
                            <select
                              value={editFormData.category}
                              onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                              className="w-full bg-navy-light border border-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple"
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
                            <label className="block text-sm text-gray-400 mb-2">Tags (comma separated)</label>
                            <input
                              type="text"
                              value={editFormData.tags}
                              onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                              className="w-full bg-navy-light border border-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple"
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
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
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
                            className="flex items-center gap-2 bg-navy text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
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
                          <h3 className="font-semibold text-white mb-1">{article.headline}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{article.summary}</p>
                          <div className="flex items-center gap-3 text-xs flex-wrap">
                            <span className="bg-purple/20 text-purple px-2 py-1 rounded">
                              {article.category}
                            </span>
                            {article.hero_image_url && (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Hero Image ✓
                              </span>
                            )}
                            {article.inline_image_url && (
                              <span className="bg-cyan/20 text-cyan px-2 py-1 rounded">
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
                            <span className="text-gray-500">
                              {new Date(article.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditArticle(article)}
                            className="p-2 text-gray-400 hover:text-purple"
                            title="Edit article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(article.content)}
                            className="p-2 text-gray-400 hover:text-white"
                            title="Copy content"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 text-gray-400 hover:text-red-400"
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
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No articles found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-light border border-purple/30 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              {editingTemplate ? 'Edit Template' : 'Save as Template'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-navy border border-purple/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple"
                placeholder="Enter a name for this template"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 bg-gradient-to-r from-purple to-cyan text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Save Template
              </button>
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  setEditingTemplate(null)
                  setTemplateName('')
                }}
                className="px-6 py-3 bg-navy text-gray-400 rounded-lg hover:text-white"
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
