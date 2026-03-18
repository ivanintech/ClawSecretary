# Secretary Mobile Integration Analysis

## Overview

ClawSecretary SAS está diseñado para ejecutarse en dispositivos móviles (iOS y Android). Esta integración aprovecha las capacidades nativas de OpenClaw a través del protocolo `node.invoke` para proporcionar una experiencia de секретарь personal completa.

## Arquitectura Mobile

```
┌─────────────────────────────────────────────────────────────┐
│                    ClawSecretary Extension                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              orchestrator.ts (1725 LOC)              │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────┐  │    │
│  │  │ Mobile (15) │ │ Slack (3)   │ │ Reminders (6)  │  │    │
│  │  │ Handlers    │ │ Handlers    │ │ Handlers       │  │    │
│  │  └──────┬──────┘ └──────┬──────┘ └───────┬────────┘  │    │
│  └─────────┼───────────────┼────────────────┼───────────┘    │
│            │               │                │                 │
│  ┌─────────▼───────────────▼────────────────▼───────────┐   │
│  │                  helpers/                               │   │
│  │  mobile.ts | slack.ts | reminders.ts | node-mode.ts   │   │
│  └─────────┬───────────────┬────────────────┬─────────────┘   │
└─────────────┼───────────────┼────────────────┼────────────────┘
              │               │                │
              ▼               ▼                ▼
     ┌─────────────────────────────────────────────────┐
     │         OpenClaw Gateway (port 18789)           │
     │  ┌─────────────────────────────────────────────┐ │
     │  │            node.invoke RPC                  │ │
     │  └─────────────────────────────────────────────┘ │
     └──────────────────────┬──────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  iOS App │      │Android App│      │  macOS  │
   │  (Swift) │      │ (Kotlin) │      │  App    │
   └──────────┘      └──────────┘      └──────────┘
```

## Módulos Móviles Integrados

### 1. Device Status (device.status)
**Comandos:**
- `device.status` - Batería, red, almacenamiento
- `device.info` - Modelo, OS, versión de app
- `device.permissions` - Permisos granted
- `device.health` - Estado de salud general

**Casos de uso para Secretary:**
- "Cómo está la batería del móvil?" → 87% cargando
- "Necesito cargar el móvil?" → Solo 23%, deberías cargar
- "Tengo espacio para fotos?" → 2.3 GB libres

### 2. Location (location.get)
**Comandos:**
- `location.get` - Coordenadas GPS con precisión configurable

**Casos de uso para Secretary:**
- "Dónde estoy ahora?" → Madrid, Spain (40.4168, -3.7038)
- "Estoy cerca de la oficina?" → 2.3 km
- "Cuánto tiempo al trabajo?" → Basado en ubicación actual + tráfico

### 3. Photos (photos.latest)
**Comandos:**
- `photos.latest` - Fotos recientes del carrete

**Casos de uso para Secretary:**
- "Qué foto saqué ayer?" → Accede a galería
- "Guarda esta foto en segundo cerebro" → OCR + análisis
- "Qué productos compré?" → Análisis de receipts

### 4. Contacts (contacts.search, contacts.add)
**Comandos:**
- `contacts.search` - Buscar por nombre
- `contacts.add` - Agregar nuevo contacto

**Casos de uso para Secretary:**
- "Busca el contacto de María" → Devuelve número
- "Agrega a Juan como contacto" → Crea entrada
- "Llama a mi abogado" → Busca + navega a Phone

### 5. Calendar (calendar.events, calendar.add)
**Comandos:**
- `calendar.events` - Eventos en rango de fechas
- `calendar.add` - Crear nuevo evento

**Casos de uso para Secretary:**
- "Qué tengo hoy?" → Lista de eventos
- "Pon cita con el médico el jueves a las 3" → Crea evento
- "Cuánto tiempo tengo hasta la próxima reunión?" → Calcula

### 6. Notifications (notifications.list, notifications.action)
**Comandos:**
- `notifications.list` - Lista de notificaciones recientes
- `notifications.action` - Abrir, descartar, o responder

**Casos de uso para Secretary:**
- "Qué notificaciones importantes tengo?" → Triage
- "Responde a ese WhatsApp" → Abre app + responde
- "Archiva ese email" → Acción sobre notificación

### 7. SMS (sms.send) - Android
**Comandos:**
- `sms.send` - Enviar SMS

**Casos de uso para Secretary:**
- "Envía SMS a mamá que llegaré tarde" → Sin abrir app
- "Confirma la cita por SMS" → Automatización

### 8. Motion (motion.activity, motion.pedometer)
**Comandos:**
- `motion.activity` - Actividad actual (caminando, sentado, etc.)
- `motion.pedometer` - Pasos y distancia

**Casos de uso para Secretary:**
- "Cuántos pasos di hoy?" → Pedometer
- "Estoy sedentario?" → Detecta inactividad
- "Recuérdame levantarme cada hora" → Basado en motion

### 9. Camera (camera.snap, camera.clip)
**Comandos:**
- `camera.snap` - Capturar foto
- `camera.clip` - Grabar video

**Casos de uso para Secretary:**
- "Toma foto de este documento" → OCR automático
- "Graba video de la presentación" → Para minutos
- "Escanea este receipt" → Capture + análisis

### 10. Screen Record (screen.record)
**Comandos:**
- `screen.record` - Grabar pantalla

**Casos de uso para Secretary:**
- "Graba la llamada de Zoom" → Tutorial
- "Captura el error de la app" → Debug
- "Demo de 30 segundos" → Crear contenido

### 11. System Notify (system.notify)
**Comandos:**
- `system.notify` - Enviar notificación push

**Casos de uso para Secretary:**
- "Recuérdame en 15 minutos" → Notification
- "Alerta: Reunión en 5 minutos" → Wake up
- "Promedio de acciones: 3" → Resumen diario

### 12. Canvas (canvas.present, canvas.hide)
**Comandos:**
- `canvas.present` - Mostrar contenido visual
- `canvas.hide` - Ocultar canvas

**Casos de uso para Secretary:**
- "Muéstrame el mapa" → Canvas con ubicación
- "Presenta el resumen" → Dashboard visual
- "Oculta la pantalla" → Modo privacidad

## Comparación: Secretary Actual vs Propuesto

| Funcionalidad | Antes | Ahora | Prioridad |
|--------------|-------|-------|----------|
| Calendario | Google Cal (gog) | gog + móvil | Alta |
| Contactos | Manual | móvil + búsqueda | Alta |
| Fotos | No | móvil + OCR | Media |
| Localización | No | móvil GPS | Media |
| Notificaciones | No | móvil triage | Alta |
| SMS | No | móvil (Android) | Media |
| Cámara | No | móvil capture | Media |
| Activity | No | móvil motion | Baja |

## Permisos Requeridos (Android/iOS)

### Android
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
<uses-permission android:name="android.permission.READ_CALENDAR" />
<uses-permission android:name="android.permission.WRITE_CALENDAR" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
```

### iOS
```xml
<key>NSCameraUsageDescription</key>
<key>NSPhotoLibraryUsageDescription</key>
<key>NSLocationWhenInUseUsageDescription</key>
<key>NSContactsUsageDescription</key>
<key>NSCalendarsUsageDescription</key>
<key>NSMotionUsageDescription</key>
```

## Implementación Técnica

### node.invoke Protocol

```typescript
// Llamada desde el helper móvil
const result = await invokeMobileCommand(api, "device.status");

// Equivale a:
await callGatewayTool("node.invoke", gatewayOpts, {
  nodeId: "self",
  command: "device.status",
  params: {},
  idempotencyKey: crypto.randomUUID(),
});
```

### Flujo de Datos

1. Secretary action llamada (ej: `mobile_location`)
2. Handler invoca helper (`getLocation()`)
3. Helper llama `invokeMobileCommand()`
4. Gateway RPC → `node.invoke`
5. Móvil recibe comando
6. Android/iOS Handler ejecuta
7. Resultado vuelve por RPC
8. Helper parsea y devuelve
9. Handler formatea respuesta
10. WAL Protocol logging

## Casos de Uso Completos

### Caso 1: Reunión con Cliente
```
Usuario: "Prepara la reunión con Carlos Pérez"
Secretary:
1. → contacts.search("Carlos Pérez") → Encuentra contacto
2. → calendar.events(hoy) → Verifica agenda
3. → location.get() → Estoy cerca de oficina?
4. → notifications.list() → Tengo mensajes urgentes?
5. → Prepara briefing con los datos
```

### Caso 2: Captura de Receipt
```
Usuario: "Escanea este receipt"
Secretary:
1. → camera.snap() → Captura imagen
2. → OCR análisis local
3. → Extrae: Restaurant X, $45.20, 18/03/2026
4. → addCalendarEvent() → Agrega a gastos
5. → "Receipt guardado: Restaurant X - $45.20"
```

### Caso 3: Recordatorio Contextual
```
Secretary (proactivo):
1. → motion.activity() → Detectando inactivo 2 horas
2. → location.get() → Still en oficina
3. → "Hora de caminar! Llevas 2h sentado."
4. → system.notify() → Envía reminder al móvil
```

## Roadmap de Integración

### Fase 4: Mobile Core (PRÓXIMA)
- [ ] Integrar calendario nativo con events de móvil
- [ ] Sincronizar contactos bidireccional
- [ ] Triage de notificaciones inteligentes
- [ ] Activity monitoring proactivo

### Fase 5: Vision/ML Mobile
- [ ] OCR en dispositivo para receipts
- [ ] Detección de objetos en fotos
- [ ] Análisis de documentos con IA local
- [ ] Whisper transcription en tiempo real

### Fase 6: Automation
- [ ] Reglas basadas en ubicación
- [ ] Automatización de respuestas SMS
- [ ] Rutinas matutinas/nocturnas
- [ ] Integración con apps de terceros

## Métricas de Test

| Componente | Tests | Estado |
|-----------|-------|--------|
| Mobile Helper | 20 funciones | ✅ |
| Mobile Handlers | 15 handlers | ✅ |
| WAL Compliance | 100% | ✅ |
| Integración existentes | 19 tests | ✅ |

## Conclusión

La integración móvil transforma ClawSecretary de un assistant de calendario a un **Secretario Personal Completo** que:
- Conoce tu ubicación y actividad
- Accede a tus contactos y fotos
- Gestiona tus notificaciones
- Envía mensajes y captura contenido
- Opera proactivamente basado en contexto

La arquitectura basada en `node.invoke` asegura que todas las operaciones pasen por el gateway de OpenClaw, manteniendo:
- Seguridad (autenticación, permisos)
- Auditabilidad (WAL logging)
- Escalabilidad (múltiples dispositivos)

---

**Fecha:** 18/03/2026
**Versión:** 1.0
**Integrado en:** Phase 3.5 - Mobile Core Integration
