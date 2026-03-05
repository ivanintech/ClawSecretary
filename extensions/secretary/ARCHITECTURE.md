# OpenClaw Mobile-Edge SaaS Architecture (March 2026)

Tras revisar el estado del arte de agentes autónomos locales en 2026 y nuestra directriz en el `DEEPWIKI` ("Tu IA, tus Reglas"), hemos rediseñado la arquitectura SaaS para que sea **100% Privacy-First y orientada al teléfono móvil del usuario (Mobile Edge)**.

El objetivo es tener la facilidad comercial de un SaaS ("Plug & Play"), pero sin la fuga de privacidad de un SaaS tradicional. **Tus embeddings, tu memoria y tu base de datos vectorial vivirán en tu teléfono**, no en nuestros servidores. 

Nuestra infraestructura nube será únicamente un "puente efímero".

---

## 🏗️ La Arquitectura: "Cloud as a Bridge, Edge as the Brain"

### 1. El Cerebro Local (El Teléfono del Usuario)
OpenClaw correrá en el dispositivo del usuario (vía PWA o como un proceso de fondo que el usuario controla).
- **Embeddings Locales:** En lugar de enviar textos a OpenAI para indexarlos, la PWA en el móvil usará modelos cuántizados en dispositivo (ej. `embeddinggemma-300m-qat-Q8_0.gguf` o WebXMT) para generar vectores.
- **LanceDB Edge:** La memoria a largo plazo vive en el sistema de archivos local del teléfono a través de una instancia local de LanceDB u Obsidian (Archivos Markdown MD).
- **Procesamiento de Voz:** Usaremos `openai-whisper` (modo local) dentro del entorno del usuario para que los audios de WhatsApp no salgan a la nube para ser transcritos.

### 2. El Puente Efímero (Next.js Serverless)
Para que el usuario pueda vincular su Notion o Calendly con 1 click sin salir de su móvil, usamos Vercel (Next.js) + **Nango** (o Truto) solo como pasarela.
- **Zero-Storage Pledges:** El SaaS no tiene base de datos persistente para los usuarios.
- **El flujo:** 
  1. El móvil abre el Dashboard PWA de OpenClaw.
  2. El usuario hace click en "Conectar Notion".
  3. El OAuth ocurre en nuestro puente usando Nango/Clerk.
  4. Una vez obtenido el `access_token` de Notion, el puente de Vercel lo inyecta **inmediatamente** hacia el teléfono (vía un WebSocket cifrado P2P) al [AutoAuthOrchestrator](file:///c:/Users/ivanc/Documents/MyProjects/openclaw/src/saas/orchestrator.ts#11-91) local del móvil.
  5. **Destrucción:** El puente borra temporalmente rastro del token (o delega todo el almacenamiento a la bóveda de Nango sin vincularlo a datos personales nuestros).

### 3. Ejecución Autónoma Directa
Una vez el token está en el `auth-profiles.json` del teléfono:
- Cuando el usuario manda un Voice Note por WhatsApp.
- El teléfono lo transcribe localmente.
- El LLM (puede ser Cloud o Local) decide crear una tarea.
- El comando se ejecuta llamando a la API de Notion **directamente desde el teléfono usando el token inyectado**, sin pasar de nuevo por nuestro servidor SaaS.

---

## 🛠️ Stack Tecnológico Modificado (Mobile-First)

| Componente | Herramienta (Marzo 2026) | Por qué encaja en la privacidad |
| :--- | :--- | :--- |
| **SaaS Dashboard** | Next.js (Vercel) + PWA | Servidor efímero. Solo rutea OAuth. |
| **OAuth Gateway** | Nango.dev (Capa Auth) | Se encarga del refresco de tokens delegados, enviándolos al móvil bajo demanda por WebSockets. |
| **Edge Storage** | LanceDB (Node/WASM) | Guarda embeddings vectoriales estáticamente en el móvil. |
| **Transcriptor** | Whisper.cpp (WASM/Local) | No envía audios a APIs de terceros. |

## ✅ Pasos Completados:
- [x] Configuración de Embeddings Locales (`embeddinggemma`).
- [x] Implementación del `Listener Mode` en el `AutoAuthOrchestrator` local (`/plugins/secretary/oauth-inject`).
- [x] Scaffold del `apps/saas-dashboard` en Next.js con estética premium.
- [x] **Secure Tunnel Enforcement (Phase 29)**: Implementación de encriptación asimétrica RSA-2048 para que el puente nunca vea los tokens en claro.
- [x] **PWA Conversion**: Dashboard Next.js convertido a PWA con manifiesto y service worker para uso móvil optimizado.
