# SecretaryOS Mobile Architecture Roadmap

## Estado Actual del Problema

El QR genera `secretaryos://install?token=xxx` pero **no existe app** para manejar este deep link. 

La meta: instalar en el móvil **SIN UI visible** pero con toda la IA (incluyendo modelos cuantizados) corriendo localmente.

---

## Arquitectura Propuesta

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
│  │ WhatsApp    │  │ Cron Jobs    │  │ Memory + Sessions  │  │
│  │ Channel     │  │ (Briefings)  │  │ (SQLite + VDB)    │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              LLM Inference Layer                      │    │
│  │  ┌─────────────────┐  ┌─────────────────────────┐   │    │
│  │  │ Cloud API        │  │ On-Device (Phase 3+)     │   │    │
│  │  │ (OpenAI/Anthropic│  │ GGUF Quantized Models   │   │    │
│  │  │  /Ollama)        │  │ llama.cpp / MLC-LLM    │   │    │
│  │  └─────────────────┘  └─────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ WebSocket RPC (node.invoke)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Device (Phone)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SecretaryOS Node App (minimal shell, no UI)           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │   │
│  │  │ WhatsApp   │  │ Local      │  │ Sensors/Cam    │  │   │
│  │  │ Webhook    │  │ Model Cache│  │ /Notifications │  │   │
│  │  │ Receiver   │  │ (GGUF)     │  │                │  │   │
│  │  └────────────┘  └────────────┘  └────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## FASE 1: Integración con OpenClaw Native Apps (Semana 1-2)

### Opción A: Usar OpenClaw iOS/Android existentes

OpenClaw ya tiene apps nativas (`apps/ios/`, `apps/android/`) con "Node mode":

```
✅ YA EXISTE
├── iOS app: apps/ios/
├── Android app: apps/android/
├── Node mode: Device paired to gateway
└── node.invoke: Camera, notifications, device actions
```

**Instalación:**
1. Usuario instala OpenClaw desde App Store / Google Play
2. Dashboard genera QR con token de emparejamiento
3. OpenClaw se conecta al gateway como "SecretaryOS Node"
4. Sin UI - solo notificaciones pushbackground

**Limitación actual:** Requiere que el usuario instale app OpenClaw explícitamente

---

## FASE 2: App Wrapper Minimal (Semana 3-4)

### Build: SecretaryOS Thin App

Una APK/IPA que simplemente:
1. Registra deep link `secretaryos://`
2. Se empareja con gateway via WebSocket
3. Solo muestra notificaciones push (no UI)
4. Background worker para mantener conexión

**Stack técnico:**
- **Android**: Kotlin + WorkManager (background)
- **iOS**: Swift + BackgroundTasks (background)

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

// SecretaryService: Background WebSocket + Notifications
class SecretaryService : Service() {
    // Conecta a gateway.ws
    // Recibe mensajes vía WebSocket
    // Muestra notifications
}
```

---

## FASE 3: On-Device LLM con GGUF (Semana 5-8)

### Tecnología: llama.cpp + GGUF Quantization

**Modelos recomendados para móvil (2026):**

| Modelo | Params | Tamaño Q4_K_M | Velocidad (Snapdragon 8 Gen 2) |
|--------|--------|---------------|--------------------------------|
| Qwen2.5-3B | 3B | ~1.8 GB | 8-12 tok/s |
| Llama 3.2-3B | 3B | ~1.6 GB | 10-14 tok/s |
| Gemma3-4B | 4B | ~2.4 GB | 6-10 tok/s |
| Phi-4-3.8B | 3.8B | ~2.1 GB | 7-11 tok/s |

**Stack de inferencia:**

```
┌─────────────────────────────────────────┐
│        SecretaryOS Mobile App            │
│  ┌─────────────────────────────────┐    │
│  │    llama.cpp (libllama.so)       │    │
│  │    GGUF model loading + CUDA/NNAPI│    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          Ollama API (local)              │
│  localhost:11434 ( Whisper → STT )      │
└─────────────────────────────────────────┘
```

**Fallback strategy:**
1. On-device GGUF primary (sin internet)
2. Ollama local (misma máquina, mejor throughput)
3. Cloud API (OpenAI/Anthropic) - solo si configura

---

## FASE 4: Full On-Device Pipeline (Semana 9-12)

### Complete Local Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Device                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Whisper.cpp (STT)                    │    │
│  │                   ~39 MB (tiny)                      │    │
│  └─────────────────────┬───────────────────────────────┘    │
│                        │ Audio → Text                       │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              llama.cpp + GGUF (LLM)                  │    │
│  │              Qwen2.5-3B-Q4_K_M (~1.8 GB)            │    │
│  │              + Ollama API wrapper                     │    │
│  └─────────────────────┬───────────────────────────────┘    │
│                        │ Response text                       │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            transformers.js (TTS)                     │    │
│  │            or: SillyTavern TTS                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            WhatsApp Web (bg)                         │    │
│  │            + notifications                            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparativa de Tecnologías (2026)

### Para On-Device LLM en Móvil:

| Tecnología | Mejor para | Tamaño | Velocidad | Difficulty |
|------------|-----------|--------|-----------|------------|
| **llama.cpp + GGUF** | Android/Linux,通用 | ~1.6-2GB | 8-14 tok/s | Media |
| **MLC-LLM** | Cross-platform, TVM | Similar | Similar | Alta |
| **MLX** | Apple Silicon solo | Optimal | ~40 tok/s | Baja |
| **Unsloth + ExecuTorch** | iOS, quantized | ~1GB | ~40 tok/s | Baja |
| **TensorFlow Lite** | Google hardware | Variable | Variable | Media |
| **Gemini Nano** | Pixel/Samsung flagships | ~1.2GB | ~20 tok/s | Muy baja |

### Proyectos de Referencia en GitHub:

1. **ollama/ollama** - 80k stars - Server LLM local más popular
2. **ggerganov/llama.cpp** - 70k stars - Motor de inferencia GGUF
3. **mlc-ai/mlc-llm** - 20k stars - Deployment cross-platform
4. **unslothai/unsloth** - 10k stars - Fine-tuning + deployment móvil
5. **LocalKinAI/localkin** - Nuevo, single-binary AI agent en Go
6. **ClawdisAI/ClawdisAI** - Fork de OpenClaw, "Always local, always listening"

---

## Roadmap Timeline

```
Semana 1-2: FASE 1
├── Investigar integración con OpenClaw iOS/Android apps
├── Generar QR de emparejamiento funcional
└── Probar conexión node → gateway

Semana 3-4: FASE 2  
├── Crear app wrapper mínima (Kotlin/Swift)
├── Registrar deep link secretaryos://
├── Background service + notifications
└── Emparejamiento WebSocket con gateway

Semana 5-8: FASE 3
├── Integrar llama.cpp en app móvil
├── Bundlenar modelo GGUF pequeño (Qwen2.5-1.5B)
├── Ollama API wrapper local
└── Fallback: cloud → local → on-device

Semana 9-12: FASE 4
├── Integrar Whisper.cpp para STT
├── TTS local (transformers.js o Piper)
├── Optimizar memoria / streaming
└── Testing en dispositivos reales

Mes 4+: Producción
├── Publicar en App Store / Play Store
├── Modelo adaptativo según hardware
├── Actualizaciones OTA del modelo
└── Monetización
```

---

## Para Empezar AHORA

### Opción Rápida (2 días):
1. Modificar install page para usar QR de OpenClaw existente
2. Usuario instala OpenClaw desde store
3. SecretaryOS actúa como "plugin" / agente en OpenClaw

### Opción Custom (2 semanas):
1. Crear app mínima wrapper
2. Integrar llama.cpp
3. Bundlenar Qwen2.5-1.5B-Q4_K_M (~800MB)
4. Publicar en Play Store como beta

---

## Referencias

- llama.cpp: https://github.com/ggerganov/llama.cpp
- MLC-LLM: https://github.com/mlc-ai/mlc-llm
- Unsloth: https://github.com/unslothai/unsloth
- Ollama: https://github.com/ollama/ollama
- On-Device LLM Android Guide: https://dev.to/software_mvp-factory/running-llms-on-device-in-android-gguf-models-nnapi-and-the-real-performance-tradeoffs-5bfc
- OpenClaw iOS/Android: apps/ios/, apps/android/
