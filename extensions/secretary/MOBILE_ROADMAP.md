# SecretaryOS Mobile Architecture Roadmap

**Last Updated:** March 21, 2026

---

## ✅ IMPLEMENTED: Privacy-First Mobile Setup (Phase 1)

### Arquitectura Simplificada

```
┌─────────────────────────────────────────────────────────────┐
│                    PHONE (Edge - Privacy First)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SecretaryOS App (PWA)                               │   │
│  │  • QR Scanner                                        │   │
│  │  • Local storage (encrypted)                          │   │
│  │  • Bridge WebSocket client                           │   │
│  │  • WhatsApp Session (Baileys)                       │   │
│  │  • Local LLM (Ollama) ← Future                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │ Bridge relay ONLY
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLOUD (Bridge)                           │
│  • Message relay only (no storage)                          │
│  • No data persists                                       │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Setup

```
Desktop (Web):
1. Visit secretaryos-web.vercel.app/install
2. Generate setup QR
3. WhatsApp linked
4. QR contains config + session

Phone (PWA):
1. Visit secretaryos-web.vercel.app/mobile
2. "Add to Home Screen"
3. Open app → Scan QR
4. Configure & connect
5. Ready (fully offline capable)
```
┌─────────────────────────────────────────────────────────────┐
│                    SecretaryOS Web (SaaS)                     │
│         Landing + Auth + Dashboard + Memory Bank             │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              OpenClaw Gateway ( VPS/Home Server )             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ WhatsApp    │  │ Cron Jobs    │  │ Device Pairing    │  │
│  │ Channel     │  │ (Briefings)  │  │ (auto-approve)    │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Device (Phone)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  OpenClaw Native App (Node Mode)                       │   │
│  │  • Scans QR → auto-pairing                            │   │
│  │  • Runs SecretaryOS extension                         │   │
│  │  • No additional UI required                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Instalación (Implementado)

```
1. User logs in to SecretaryOS Web
       ↓
2. Goes to Settings → Configures Gateway URL (wss://gateway:18789)
       ↓
3. Goes to Install → Generates QR code
       ↓
4. QR contains: /install/setup/{token}
       ↓
5. Mobile opens URL → Server validates token
       ↓
6. If gateway configured: Generates pairing URL (openclaw://pair?...)
       ↓
7. OpenClaw app handles pairing URL
       ↓
8. Device auto-connects as SecretaryOS Node
```

### Archivos Creados

| File | Purpose |
|------|---------|
| `apps/secretaryos-web/src/app/api/install/token/route.ts` | Create install tokens |
| `apps/secretaryos-web/src/app/api/install/validate/route.ts` | Validate tokens, generate pairing URL |
| `apps/secretaryos-web/src/app/api/profile/gateway/route.ts` | Gateway URL CRUD |
| `apps/secretaryos-web/src/app/install/setup/[token]/page.tsx` | Token validation & QR display |
| `apps/secretaryos-web/src/app/dashboard/settings/page.tsx` | Updated with gateway config |
| `apps/secretaryos-web/src/lib/migrations/001_add_gateway_url.sql` | DB schema update |

---

## FASE 2: App Wrapper Minimal (Pendiente)

### Build: SecretaryOS Thin App (Future)

Si se requiere una app personalizada en lugar de OpenClaw:

```
┌─────────────────────────────────────────┐
│        SecretaryOS Thin App              │
│  ┌─────────────────────────────────┐    │
│  │  WebView → SecretaryOS Web      │    │
│  │  Deep Link Handler              │    │
│  │  Background Worker (minimal)     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│          OpenClaw Gateway                │
│  • Pairing → Node Mode                  │
│  • SecretaryOS extension active          │
└─────────────────────────────────────────┘
```

**Código mínimo (~500 líneas por plataforma):**

```kotlin
// Android: MainActivity mínimo
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // No UI - solo iniciar servicio
        startService(Intent(this, SecretaryService::class.java))
        finish() // Cierra inmediatamente
    }
}
```

---

## FASE 3: On-Device LLM con GGUF (Future)

### Tecnología: llama.cpp + GGUF Quantization

**Modelos recomendados para móvil (2026):**

| Modelo | Params | Tamaño Q4_K_M | Velocidad (Snapdragon 8 Gen 2) |
|--------|--------|---------------|--------------------------------|
| Qwen2.5-3B | 3B | ~1.8 GB | 8-12 tok/s |
| Llama 3.2-3B | 3B | ~1.6 GB | 10-14 tok/s |
| Gemma3-4B | 4B | ~2.4 GB | 6-10 tok/s |
| Phi-4-3.8B | 3.8B | ~2.1 GB | 7-11 tok/s |

---

## Roadmap Timeline

```
✅ FASE 1 (COMPLETADO): Mobile Deep Link Handler
├── Token validation API
├── Gateway URL configuration
├── QR code generation
└── OpenClaw native app pairing

🔄 FASE 2 (Pendiente): Thin App Wrapper
├── Custom WebView wrapper (optional)
├── Deep link handling
└── Background service

📋 FASE 3 (Futuro): On-Device LLM
├── Integrar llama.cpp
├── Bundlenar modelo GGUF pequeño
└── Ollama API wrapper local

📋 FASE 4 (Futuro): Full Pipeline
├── Whisper.cpp para STT
├── TTS local
└── Testing en dispositivos reales
```

---

## Referencias

- llama.cpp: https://github.com/ggerganov/llama.cpp
- MLC-LLM: https://github.com/mlc-ai/mlc-llm
- Unsloth: https://github.com/unslothai/unsloth
- Ollama: https://github.com/ollama/ollama
- OpenClaw iOS/Android: apps/ios/, apps/android/
