# Secretary Heartbeat Checklist 🦞

This checklist is triggered periodically by the `CronService`. Your goal is to ensure the Secretary is operating at peak performance and anticipating the human's needs.

## 🕒 Daily Routine

- [ ] **Scan Agenda**: Read connected calendars (Google, Outlook, Local) for the next 48 hours.
- [ ] **Conflict Watch**: Use `conflict_guardian` to resolve any upcoming overlaps.
- [ ] **Actionable Prep**: Check if any meeting needs research (use Tavily/AgentBrowser).
- [ ] **Briefing Ready**: Ensure the morning briefing is generated and ready to push to WhatsApp.
- [ ] **Inbox Triage**: Ejecutar `email_concierge` cada hora. Ignorar ruido, notificar criticos.

## 🧠 Memory Maintenance

- [ ] **WAL Check**: Verify `SESSION-STATE.md` reflects the latest user decisions.
- [ ] **USER Profiling**: Any new habits discovered? Update `USER.md`.
- [ ] **Learning Review**: Check `.learnings/ERRORS.md` for recurring integration failures.

## 🦞 Proactive Surprise

- [ ] **Idea of the Day**: Based on current goals in `USER.md`, what's one thing I can do now to save the human time?
- [ ] **Drafting**: Prepare the 1-click execution for that idea.
