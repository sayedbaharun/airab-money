import React from 'react'
import { Link } from 'react-router-dom'
import PageSeo from '../components/PageSeo'

const NotFoundPage = () => {
  return (
    <>
      <PageSeo
        title="Page Not Found"
        description="The requested AIRAB Money page could not be found."
        robots="noindex,nofollow"
      />

      <section className="editorial-page">
        <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
          <div className="eyebrow">AIRAB desk</div>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">This page is off the map.</h1>
          <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
            The route may have moved during the soft launch. Return to the front page or continue from the coverage archive.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rose-button">
              Return home
            </Link>
            <Link to="/articles" className="ghost-button">
              Open coverage
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default NotFoundPage
