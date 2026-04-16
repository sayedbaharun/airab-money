import React from 'react'
import { Link } from 'react-router-dom'
import PageSeo from '../components/PageSeo'
import PageIntro from '../components/PageIntro'

const sections = [
  {
    title: 'Editorial use',
    body:
      'AIRAB Money is an editorial and market-intelligence site. The material published here is for information only and should not be treated as investment advice, legal advice, or any form of regulated recommendation.',
  },
  {
    title: 'Content standards',
    body:
      'AIRAB may use AI-assisted drafting and production workflows. Public content is intended to be reviewed before publication, but the site should still be read as editorial output rather than as an official filing or a substitute for primary source documents.',
  },
  {
    title: 'External links and sources',
    body:
      'AIRAB may link to original company announcements, filings, articles, or third-party sources. Those sources remain the responsibility of their own publishers, and AIRAB is not responsible for changes made after publication.',
  },
  {
    title: 'No guarantees',
    body:
      'AIRAB aims to keep the site available and accurate, but does not guarantee uninterrupted service, complete accuracy, or ongoing availability of any page, archive item, market feed, or submission workflow.',
  },
  {
    title: 'User submissions',
    body:
      'If you submit a contact request, guest application, or newsletter signup, you confirm that the information you provide is accurate and that you have the right to provide it. AIRAB may review, store, and respond to those submissions as part of operating the desk.',
  },
]

const TermsPage = () => {
  return (
    <>
      <PageSeo
        title="Terms of Use"
        description="The operating terms for using AIRAB Money, including editorial limitations, source links, and the scope of the soft launch service."
        path="/terms"
      />

      <PageIntro
        eyebrow="Terms"
        title="The operating terms for using the AIRAB site."
        description="AIRAB is launching as a focused editorial product. These terms set the boundaries clearly: informational use, source-first reading, and no implied investment or legal advice."
        actions={
          <Link to="/privacy" className="ghost-button">
            Read privacy policy
          </Link>
        }
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            {sections.map((section) => (
              <article key={section.title} className="editorial-panel p-6 md:p-8">
                <h2 className="font-serif text-3xl tracking-[-0.04em] text-off-white">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-brushed-silver">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="editorial-panel p-6">
              <div className="stat-kicker">Scope</div>
              <p className="mt-3 text-sm leading-7 text-brushed-silver">
                These terms apply to the public site, the soft-launch newsletter list, and all inbound submission flows available on AIRAB Money.
              </p>
            </div>
            <div className="editorial-panel p-6">
              <div className="stat-kicker">Questions</div>
              <p className="mt-3 text-sm leading-7 text-brushed-silver">
                Questions about these terms can be sent through the contact page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default TermsPage
