import { chromium, devices } from 'playwright'

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3001'
const adminPassword = process.env.ADMIN_PASSWORD || ''

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const expectNoHorizontalOverflow = async (page, label) => {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  assert(!hasOverflow, `${label} has horizontal overflow on mobile`)
}

const clickVisibleLink = async (page, href) => {
  const links = page.locator(`a[href="${href}"]`)
  const count = await links.count()

  for (let index = 0; index < count; index += 1) {
    const link = links.nth(index)
    if (await link.isVisible()) {
      await link.click()
      return
    }
  }

  throw new Error(`No visible link found for ${href}`)
}

const visitAndCheckTitle = async (page, path, expected) => {
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')
  const title = await page.title()
  assert(title.includes(expected), `Expected "${expected}" in title for ${path}, got "${title}"`)
}

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
  const mobileContext = await browser.newContext({
    ...devices['iPhone 13'],
  })
  const mobile = await mobileContext.newPage()

  try {
    const visibleRoutes = [
      ['/', 'Editorial Data Desk'],
      ['/articles', 'Latest Coverage'],
      ['/markets', 'Markets Desk'],
      ['/about', 'About'],
      ['/contact', 'Contact the Desk'],
      ['/guest-application', 'Guest Desk'],
      ['/privacy', 'Privacy Policy'],
      ['/terms', 'Terms of Use'],
    ]

    for (const [path, title] of visibleRoutes) {
      await visitAndCheckTitle(desktop, path, title)
    }

    await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
    const homepageText = await desktop.textContent('body')
    assert(!homepageText.includes('Briefings'), 'Homepage still exposes hidden briefings nav')
    assert(!homepageText.includes('Analysis'), 'Homepage still exposes hidden analysis nav')
    assert(!homepageText.includes('Studio'), 'Homepage still exposes hidden studio nav')

    const emptyHashLinks = await desktop.locator('a[href="#"]').count()
    assert(emptyHashLinks === 0, 'Found placeholder hash links in the public UI')

    await desktop.goto(`${baseUrl}/episodes`, { waitUntil: 'networkidle' })
    await desktop.waitForURL(`${baseUrl}/`)
    await desktop.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' })
    await desktop.waitForURL(`${baseUrl}/`)
    await desktop.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' })
    await desktop.waitForURL(`${baseUrl}/`)

    await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
    const signupEmail = `qa-newsletter-${Date.now()}@example.com`
    await desktop.getByPlaceholder('name@company.com').fill(signupEmail)
    await desktop.getByRole('button', { name: 'Join the list' }).click()
    await desktop.waitForSelector('text=You are subscribed to the AIRAB Money newsletter.')

    await desktop.goto(`${baseUrl}/contact`, { waitUntil: 'networkidle' })
    await desktop.getByLabel('Full name *').fill('Soft Launch QA')
    await desktop.getByLabel('Email address *').fill(`qa-contact-${Date.now()}@example.com`)
    await desktop.getByLabel('Subject').fill('Soft launch contact flow')
    await desktop.getByLabel('Message *').fill('This is an end-to-end contact form verification for the AIRAB soft launch.')
    await desktop.getByRole('button', { name: 'Send message' }).click()
    await desktop.waitForSelector('text=Your message has been received. We will get back to you shortly.')

    await desktop.goto(`${baseUrl}/guest-application`, { waitUntil: 'networkidle' })
    await desktop.getByLabel('Full name *').fill('Soft Launch QA Guest')
    await desktop.getByLabel('Email address *').fill(`qa-guest-${Date.now()}@example.com`)
    await desktop.getByLabel('Professional bio *').fill(
      'Operator testing the AIRAB guest application flow with enough detail to satisfy the current form validation requirements during soft launch QA.',
    )
    await desktop.getByText('Sovereign and institutional capital').click()
    await desktop.getByText('How Gulf capital is being deployed into global AI').click()
    await desktop.getByRole('button', { name: 'Submit application' }).click()
    await desktop.waitForSelector('text=Your guest application has been submitted for review.')

    assert(adminPassword, 'ADMIN_PASSWORD is required for the admin QA pass')
    await desktop.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' })
    await desktop.getByPlaceholder('Enter admin password').fill(adminPassword)
    await desktop.getByRole('button', { name: 'Login' }).click()
    await desktop.waitForSelector('text=Admin Dashboard')
    await desktop.getByRole('button', { name: 'Studio Lab' }).click()
    await desktop.waitForSelector('text=Internal workflow for briefings, voice tests, and publishing experiments')
    await desktop.getByRole('button', { name: 'Articles' }).click()
    await desktop.waitForSelector('text=All Articles')

    await mobile.goto(baseUrl, { waitUntil: 'networkidle' })
    await expectNoHorizontalOverflow(mobile, 'Homepage')
    await mobile.getByLabel('Toggle navigation').click()
    await mobile.waitForTimeout(250)
    await clickVisibleLink(mobile, '/contact')
    await mobile.waitForURL(`${baseUrl}/contact`)
    await expectNoHorizontalOverflow(mobile, 'Contact page')

    await mobile.goto(`${baseUrl}/markets`, { waitUntil: 'networkidle' })
    await expectNoHorizontalOverflow(mobile, 'Markets page')

    console.log('Soft-launch QA passed')
  } finally {
    await mobileContext.close()
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
