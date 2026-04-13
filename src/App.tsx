import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import AboutPage from './pages/AboutPage'
import EpisodesPage from './pages/EpisodesPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import PresentersPage from './pages/PresentersPage'
import MarketsPage from './pages/MarketsPage'

import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground dark">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/article/:id" element={<ArticleDetailPage />} />
              <Route path="/presenters" element={<PresentersPage />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/content" element={<EpisodesPage />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/episodes" element={<EpisodesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App