# Soft-Launch Backlog

Last updated: 2026-04-16

## Hidden From The Public Nav

These areas are intentionally hidden for the soft launch so the public site only exposes surfaces that can be operated credibly by one person.

### 1. Briefings archive

- Public routes hidden:
  - `/episodes`
- Why it is hidden:
  - No published episode inventory yet
  - No real release cadence yet
  - Audio and transcript distribution still need a reliable workflow
- Bring-back checklist:
  - Publish at least 3-5 real briefings
  - Confirm audio hosting, transcript storage, and release QA
  - Add clear release metadata and archive filters

### 2. Analysis / capital notes

- Public routes hidden:
  - `/blog`
  - `/blog/:slug`
- Why it is hidden:
  - No published long-form analysis inventory yet
  - The public site should not surface empty archives during the soft launch
- Bring-back checklist:
  - Publish at least 3 finished notes
  - Define note categories and house style
  - Add featured note logic against real content

### 3. Public studio demo

- Public routes hidden:
  - `/demo`
- Why it is hidden:
  - The current public studio is a simulation rather than a real TTS workflow
  - Exposing it publicly weakens launch credibility
- Bring-back checklist:
  - Wire the studio to a real script-to-audio pipeline
  - Add rendering state, audio playback, and saved outputs
  - Connect the studio to YouTube/podcast distribution steps

## Admin/Internal Work That Remains

### Studio Lab

- Keep building inside the admin area first
- Use it to test presenter scripts, workflow steps, and operational checklists
- Only reopen the public studio after the lab produces real outputs consistently

### Market Feed

- Markets remain public during soft launch
- Current requirement before calling it fully live:
  - Connect the server endpoint to the final market data source
  - Verify symbol coverage and update cadence
  - Replace any soft-launch snapshot language once the feed is live

### Editorial Readiness

- Replace the remaining test content with real launch articles
- Keep the archive small and clean until the publishing cadence is stable
- Do not reopen hidden sections until each one has enough real inventory to feel intentional
