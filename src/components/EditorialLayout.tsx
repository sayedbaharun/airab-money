import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Sidebar from './Sidebar'

const EditorialLayout = () => {
  return (
    <div className="relative min-h-screen bg-graphite text-off-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,124,116,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(192,192,192,0.05),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <Sidebar />

      <div className="relative min-h-screen lg:ml-80">
        <main className="min-h-screen pt-20 lg:pt-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default EditorialLayout
