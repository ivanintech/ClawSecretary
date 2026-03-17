import type { OpenClawConfig } from "../../../src/config/config.js";
import { resolveTtsConfig } from "../../../src/config/types.tts.js";
import type { SpeechVoiceOption } from "../../../src/tts/provider-types.js";
import { normalizeSpeechProviderId } from "../../../src/tts/provider-registry.js";
import { listSpeechVoices } from "../../../src/tts/tts.js";

export type VoiceContext =
  | "briefing" // Calm, professional tone for daily briefings
  | "alert" // Fast, urgent tone for critical alerts
  | "conversational" // Friendly tone for casual messages
  | "presentation" // Formal, authoritative tone for reports
  | "default"; // Standard tone

export type VoiceSelectionResult = {
  voiceId: string;
  speed?: number;
  gender?: string;
  voiceName?: string;
};

/**
 * Selects an appropriate TTS voice based on the context of the message.
 * Falls back to provider default if no suitable voice found.
 */
export async function selectVoiceForContext(
  context: VoiceContext,
  cfg?: OpenClawConfig,
): Promise<VoiceSelectionResult> {
  try {
    const config = cfg ? resolveTtsConfig(cfg) : undefined;
    if (!config) {
      console.log("[TTS:VoiceSelector] ⚠️ No TTS config found, using provider default");
      return { voiceId: "" };
    }

    const provider = normalizeSpeechProviderId(config.provider);
    if (!provider) {
      console.log("[TTS:VoiceSelector] ⚠️ No TTS provider configured, using default");
      return { voiceId: "" };
    }

    const voices = await listSpeechVoices({ provider, cfg });
    if (voices.length === 0) {
      console.log("[TTS:VoiceSelector] ℹ️ No voices available, using provider default");
      return { voiceId: "" };
    }

    console.log(`[TTS:VoiceSelector] 🎭 Context: ${context}, Available voices: ${voices.length}`);

    switch (context) {
      case "briefing":
        return selectBriefingVoice(voices);
      case "alert":
        return selectAlertVoice(voices);
      case "conversational":
        return selectConversationalVoice(voices);
      case "presentation":
        return selectPresentationVoice(voices);
      default:
        return voices[0] ? { voiceId: voices[0].id, voiceName: voices[0].name } : { voiceId: "" };
    }
  } catch (error) {
    console.error("[TTS:VoiceSelector] ❌ Error selecting voice:", error);
    return { voiceId: "" };
  }
}

function selectBriefingVoice(voices: SpeechVoiceOption[]): VoiceSelectionResult {
  // Preference: calm, neutral, female voice for briefings
  const preferred = voices.find(
    (v) =>
      (v.personalities?.includes("calm") ||
        v.personalities?.includes("neutral") ||
        v.name?.toLowerCase().includes("calm")) &&
      (v.gender === "female" || !v.gender),
  );

  if (preferred) {
    console.log(`[TTS:VoiceSelector] ✅ Selected briefing voice: ${preferred.name || preferred.id}`);
    return {
      voiceId: preferred.id,
      speed: 0.9, // Slightly slower for clarity
      gender: preferred.gender,
      voiceName: preferred.name,
    };
  }

  // Fallback: any female voice
  const femaleVoice = voices.find((v) => v.gender === "female");
  if (femaleVoice) {
    console.log(`[TTS:VoiceSelector] ✅ Selected female fallback voice: ${femaleVoice.name || femaleVoice.id}`);
    return {
      voiceId: femaleVoice.id,
      speed: 0.9,
      gender: femaleVoice.gender,
      voiceName: femaleVoice.name,
    };
  }

  // Final fallback: first voice
  const firstVoice = voices[0];
  console.log(`[TTS:VoiceSelector] ✅ Fallback to first voice: ${firstVoice.name || firstVoice.id}`);
  return {
    voiceId: firstVoice.id,
    speed: 0.9,
    gender: firstVoice.gender,
    voiceName: firstVoice.name,
  };
}

function selectAlertVoice(voices: SpeechVoiceOption[]): VoiceSelectionResult {
  // Preference: fast, urgent tone for alerts
  const preferred = voices.find(
    (v) =>
      (v.personalities?.includes("urgent") ||
        v.personalities?.includes("energetic") ||
        v.name?.toLowerCase().includes("urgent")) &&
      (v.gender === "male" || !v.gender),
  );

  if (preferred) {
    console.log(`[TTS:VoiceSelector] ✅ Selected alert voice: ${preferred.name || preferred.id}`);
    return {
      voiceId: preferred.id,
      speed: 1.2, // Faster for urgency
      gender: preferred.gender,
      voiceName: preferred.name,
    };
  }

  // Fallback: any male voice
  const maleVoice = voices.find((v) => v.gender === "male");
  if (maleVoice) {
    console.log(`[TTS:VoiceSelector] ✅ Selected male fallback voice: ${maleVoice.name || maleVoice.id}`);
    return {
      voiceId: maleVoice.id,
      speed: 1.2,
      gender: maleVoice.gender,
      voiceName: maleVoice.name,
    };
  }

  // Final fallback: first voice
  const firstVoice = voices[0];
  console.log(`[TTS:VoiceSelector] ✅ Fallback to first voice: ${firstVoice.name || firstVoice.id}`);
  return {
    voiceId: firstVoice.id,
    speed: 1.2,
    gender: firstVoice.gender,
    voiceName: firstVoice.name,
  };
}

function selectConversationalVoice(voices: SpeechVoiceOption[]): VoiceSelectionResult {
  // Preference: friendly, warm tone for casual messages
  const preferred = voices.find(
    (v) =>
      (v.personalities?.includes("friendly") ||
        v.personalities?.includes("warm") ||
        v.name?.toLowerCase().includes("friendly")) &&
      v.gender,
  );

  if (preferred) {
    console.log(`[TTS:VoiceSelector] ✅ Selected conversational voice: ${preferred.name || preferred.id}`);
    return {
      voiceId: preferred.id,
      speed: 1.0, // Normal speed
      gender: preferred.gender,
      voiceName: preferred.name,
    };
  }

  // Fallback: any voice with female gender
  const femaleVoice = voices.find((v) => v.gender === "female");
  if (femaleVoice) {
    console.log(`[TTS:VoiceSelector] ✅ Selected female conversational voice: ${femaleVoice.name}`);
    return {
      voiceId: femaleVoice.id,
      speed: 1.0,
      gender: femaleVoice.gender,
      voiceName: femaleVoice.name,
    };
  }

  const firstVoice = voices[0];
  console.log(`[TTS:VoiceSelector] ✅ Fallback to conversational voice: ${firstVoice.name}`);
  return {
    voiceId: firstVoice.id,
    speed: 1.0,
    gender: firstVoice.gender,
    voiceName: firstVoice.name,
  };
}

function selectPresentationVoice(voices: SpeechVoiceOption[]): VoiceSelectionResult {
  // Preference: formal, authoritative tone for presentations
  const preferred = voices.find(
    (v) =>
      (v.personalities?.includes("formal") ||
        v.personalities?.includes("authoritative") ||
        v.name?.toLowerCase().includes("news")) &&
      v.gender === "male",
  );

  if (preferred) {
    console.log(`[TTS:VoiceSelector] ✅ Selected presentation voice: ${preferred.name || preferred.id}`);
    return {
      voiceId: preferred.id,
      speed: 0.95, // Slightly slower for clarity
      gender: preferred.gender,
      voiceName: preferred.name,
    };
  }

  // Fallback: any male voice
  const maleVoice = voices.find((v) => v.gender === "male");
  if (maleVoice) {
    console.log(`[TTS:VoiceSelector] ✅ Selected male presentation voice: ${maleVoice.name}`);
    return {
      voiceId: maleVoice.id,
      speed: 0.95,
      gender: maleVoice.gender,
      voiceName: maleVoice.name,
    };
  }

  const firstVoice = voices[0];
  console.log(`[TTS:VoiceSelector] ✅ Fallback to presentation voice: ${firstVoice.name}`);
  return {
    voiceId: firstVoice.id,
    speed: 0.95,
    gender: firstVoice.gender,
    voiceName: firstVoice.name,
  };
}