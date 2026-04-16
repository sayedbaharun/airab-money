import React from 'react'
import { Link } from 'react-router-dom'
import PageSeo from '../components/PageSeo'
import PageIntro from '../components/PageIntro'

const sections = [
  {
    title: 'What AIRAB collects',
    body:
      'AIRAB collects the information you submit directly through the site, including newsletter signups, contact messages, and guest applications. That can include your name, email address, company details, and anything you choose to include in a message.',
  },
  {
    title: 'How AIRAB uses it',
    body:
      'The data is used to run the editorial desk: sending article and video notifications, reviewing inbound leads, replying to contact requests, and evaluating guest applications. AIRAB does not need more personal data than that to operate this site.',
  },
  {
    title: 'Analytics',
    body:
      'AIRAB may use privacy-conscious website analytics to understand which pages are being used, how the desk is discovered, and where technical issues appear. The goal is product and editorial improvement, not profile building.',
  },
  {
    title: 'How data is stored',
    body:
      'Form submissions and subscriber records are stored in the AIRAB operational database. Access is limited to the operator of the desk and to the infrastructure providers needed to host the service.',
  },
  {
    title: 'Sharing and third parties',
    body:
      'AIRAB does not sell your personal data. Information may be processed by infrastructure providers used for hosting, database storage, email delivery, analytics, or publishing operations, but only to operate the service.',
  },
  {
    title: 'Your choices',
    body:
      'You can request removal from the mailing list or ask for your submitted information to be deleted by contacting hello@airabmoney.com. AIRAB will handle reasonable requests as quickly as possible.',
  },
]

const PrivacyPage = () => {
  return (
    <>
      <PageSeo
        title="Privacy Policy"
        description="How AIRAB Money handles newsletter signups, contact messages, guest applications, and basic website analytics during the soft launch."
        path="/privacy"
      />

      <PageIntro
        eyebrow="Privacy"
        title="A simple privacy policy for the AIRAB soft launch."
        description="AIRAB is a lean editorial operation. The policy is correspondingly simple: collect only what is needed to run the desk, use it carefully, and keep the data footprint small."
        actions={
          <Link to="/contact" className="ghost-button">
            Contact the desk
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
              <div className="stat-kicker">Contact</div>
              <p className="mt-3 text-sm leading-7 text-brushed-silver">
                Privacy requests and unsubscribe requests can be sent to hello@airabmoney.com.
              </p>
            </div>
            <div className="editorial-panel p-6">
              <div className="stat-kicker">Version</div>
              <p className="mt-3 text-sm leading-7 text-brushed-silver">
                This policy covers the AIRAB Money soft launch and should be revised as the desk adds more distribution and automation.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default PrivacyPage
