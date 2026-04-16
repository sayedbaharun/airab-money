import React from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import EditorialLayout from './components/EditorialLayout'
import SiteAnalytics from './components/SiteAnalytics'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import MarketsPage from './pages/MarketsPage'
import AdminPage from './pages/AdminPage'
import GuestApplicationPage from './pages/GuestApplicationPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <SiteAnalytics />
        <Routes>
          <Route element={<EditorialLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/guest-application" element={<GuestApplicationPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/episodes" element={<Navigate to="/" replace />} />
            <Route path="/blog" element={<Navigate to="/" replace />} />
            <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
            <Route path="/demo" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
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
