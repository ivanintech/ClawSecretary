import { execFileAsync } from "./common.js";
import { resolveApiKeyForProvider } from "../../../../src/agents/model-auth.js";
import type { OpenClawConfig } from "../../../../src/config/config.js";
import { loadConfig } from "../../../../src/config/config.js";
import type { RunWebSearchParams } from "../../../../src/web-search/runtime.js";
import { runWebSearch } from "../../../../src/web-search/runtime.js";

export async function performWebSearch(
  query: string,
  options?: { providerId?: string; maxResults?: number },
): Promise<{ title: string; url: string; snippet?: string }[]> {
  try {
    const cfg = await loadConfig() as OpenClawConfig;
    
    const searchParams: RunWebSearchParams = {
      args: {
        query,
        max_results: options?.maxResults ?? 10,
      },
      config: cfg,
    };
    
    if (options?.providerId) {
      searchParams.providerId = options.providerId;
    }
    
    const { provider, result } = await runWebSearch(searchParams);
    console.log(`[Secretary:Intelligence] ✅ Web search completed using provider: ${provider}`);
    
    const searchResults = result.results as any[] || [];
    return searchResults.slice(0, options?.maxResults ?? 10).map((r) => ({
      title: r.title ?? "Sin título",
      url: r.url,
      snippet: r.content,
    }));
  } catch (error) {
    console.error(`[Secretary:Intelligence] ❌ Web search failed: ${error}`);
    return [];
  }
}

export async function fetchRssDigest(): Promise<{ title: string; blog: string; url?: string }[]> {
  try {
    const { stdout } = await execFileAsync("blogwatcher", ["articles", "--json"]);
    const raw = JSON.parse(stdout) as any[];
    return raw.slice(0, 10).map((a) => ({
      title: a.title ?? "Sin título",
      blog: a.blog ?? "Feed",
      url: a.url,
    }));
  } catch {
    return [];
  }
}

export async function fetchNearbyVenues(
  query: string,
  lat?: number,
  lng?: number,
): Promise<{ name: string; address: string; rating: number }[]> {
  // AUTO-OAUTH: Verificar si tenemos Google Places API keys
  try {
    const cfg = await loadConfig() as OpenClawConfig;
    const auth = await resolveApiKeyForProvider({
      provider: "google-places", // o "google-maps"
      cfg,
    });
    console.log("[Secretary:Intelligence] ✅ Auto-detected Google Places API key");
    // TODO: Implementar Google Places API calls en vez de CLI
    // Por ahora seguimos con el mock CLI
  } catch {
    console.log("[Secretary:Intelligence] ℹ️  No Google Places auth found, using CLI mock");
  }

  try {
    const args = ["search", query, "--json", "--limit", "3", "--min-rating", "4"];
    if (lat !== undefined && lng !== undefined) {
      args.push("--lat", String(lat), "--lng", String(lng), "--radius-m", "2000");
    }
    const { stdout } = await execFileAsync("goplaces", args);
    const raw = JSON.parse(stdout) as any[];
    return raw.map((p) => ({
      name: p.name ?? "Lugar desconocido",
      address: p.formatted_address ?? "",
      rating: p.rating ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function fetchOrderHistory(): Promise<
  { code: string; items: string; restaurant: string }[]
> {
  try {
    const { stdout } = await execFileAsync("ordercli", [
      "foodora",
      "history",
      "--limit",
      "5",
      "--json",
    ]);
    const raw = JSON.parse(stdout) as any[];
    return raw.map((o) => ({
      code: o.code,
      restaurant: o.vendor_name ?? "Restaurante",
      items: o.summary ?? "",
    }));
  } catch {
    return [];
  }
}

export async function fetchWeather(city: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("curl", [
      "-s",
      `wttr.in/${encodeURIComponent(city)}?format=%c+%t+%w+%h`,
    ]);
    return stdout.trim() || "☁️ Tiempo no disponible";
  } catch {
    return "☁️ Tiempo no disponible";
  }
}
