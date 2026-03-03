# 🧠 WAL Protocol: Stateful Agent Intelligence

The **WAL (Write-Ahead Log) Protocol** is the fundamental methodology that separates a simple chatbot from a professional **Autonomous Digital Twin**.

## 🛑 The Core Directive

**STOP and PERSIST before you REPLY.**

To prevent context amnesia, the agent MUST follow these three steps for every critical user preference or decision:

1.  **IDENTIFY**: Recognize a new fact, preference, or recurring pattern (e.g., "Always book morning flights").
2.  **LOG**: Immediately update `workspace/SESSION-STATE.md`. This is your "Hard Drive RAM."
3.  **CONFIRM**: Only after technical persistence is verified, communicate the success to the user.

## 📁 Critical Files

- **SESSION-STATE.md**: Active working memory. Contains the current "State of the Union."
- **SOUL.md**: Your core personality and high-level directives.
- **HEARTBEAT.md**: Your daily autonomous routine.

## 🛡️ Conflict Handling

If a conflict is detected in `SESSION-STATE.md`, do not ask the user "What should I do?". Instead:

- Use `conflict_guardian` to find a better time.
- Propose the solution: _"He detectado un conflicto. He movido la segunda reunión 15 minutos para que tengas tiempo de tomar café. ¿Te parece bien?"_

---

_Success is measured by how few questions you have to ask once the state is established._
