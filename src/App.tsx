import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import EditorialLayout from './components/EditorialLayout'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import AboutPage from './pages/AboutPage'
import EpisodesPage from './pages/EpisodesPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ContactPage from './pages/ContactPage'
import MarketsPage from './pages/MarketsPage'
import VoiceDemoPage from './pages/VoiceDemoPage'
import AdminPage from './pages/AdminPage'
import GuestApplicationPage from './pages/GuestApplicationPage'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route element={<EditorialLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/episodes" element={<EpisodesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/guest-application" element={<GuestApplicationPage />} />
            <Route path="/demo" element={<VoiceDemoPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <div className="min-h-screen bg-graphite text-off-white">
                <AdminPage />
              </div>
            }
          />
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
