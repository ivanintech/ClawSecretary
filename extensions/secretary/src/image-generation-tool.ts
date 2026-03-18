import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "../../../src/plugins/types.js";

/**
 * Image Generation Tool
 * 
 * Generates images using OpenClaw's native image generation API.
 * Supports multiple providers (DALL-E, Midjourney, etc.) and custom models.
 * 
 * Use Cases:
 * - Calendar summary visualizations
 * - Meeting diagrams and flowcharts
 * - Visual briefings and reports
 * - PKM documentation images
 */
export function createImageGenerationTool(api: OpenClawPluginApi) {
  const tool = {
    name: "image_generator",
    description: "Generate images for calendar summaries, meeting diagrams, visual briefings, and PKM documentation using OpenClaw's native image generation API with support for multiple providers (DALL-E, Midjourney, etc.).",
    inputSchema: Type.Object({
      prompt: Type.String({
        description: "Text prompt describing the image to generate",
      }),
      model: Type.Optional(
        Type.String({
          description: "Override default model in format 'provider/model' (e.g., 'openai/dall-e-3', 'midjourney/v6')",
        }),
      ),
      count: Type.Optional(
        Type.Number({
          description: "Number of images to generate (default: 1)",
          minimum: 1,
          maximum: 10,
        }),
      ),
      size: Type.Optional(
        Type.String({
          description: "Image size in format 'WIDTHxHEIGHT' (e.g., '1024x1024')",
        }),
      ),
      resolution: Type.Optional(
        Type.Union([Type.Literal("1K"), Type.Literal("2K"), Type.Literal("4K")], {
          description: "Image resolution quality (default: provider default)",
        }),
      ),
      useCase: Type.Optional(
        Type.Union([
          Type.Literal("calendar_summary"),
          Type.Literal("meeting_diagram"),
          Type.Literal("visual_briefing"),
          Type.Literal("pkm_documentation"),
        ], {
          description: "Pre-defined use case for automatic prompt enhancement",
        }),
      ),
    }),

    execute: async (
      _context: any,
      args: Record<string, unknown>,
    ) => {
      try {
        const prompt = args.prompt as string;
        const model = args.model as string | undefined;
        const count = (args.count as number | undefined) ?? 1;
        const size = args.size as string | undefined;
        const resolution = args.resolution as "1K" | "2K" | "4K" | undefined;
        const useCase = args.useCase as
          | "calendar_summary"
          | "meeting_diagram"
          | "visual_briefing"
          | "pkm_documentation"
          | undefined;

        let enhancedPrompt = prompt;
        
        if (useCase) {
          switch (useCase) {
            case "calendar_summary":
              enhancedPrompt = `Professional calendar summary visualization: ${prompt}`;
              break;
            case "meeting_diagram":
              enhancedPrompt = `Clear meeting diagram or flowchart: ${prompt}`;
              break;
            case "visual_briefing":
              enhancedPrompt = `Executive visual briefing infographic: ${prompt}`;
              break;
            case "pkm_documentation":
              enhancedPrompt = `Educational PKM documentation diagram: ${prompt}`;
              break;
          }
          console.log(`[Secretary:ImageGen] 🎨 Use case '${useCase}' - Enhanced prompt applied`);
        }

        console.log(`[Secretary:ImageGen] 🎨 Generating image(s): ${enhancedPrompt}`);
        if (model) {
          console.log(`[Secretary:ImageGen] 🎨 Using model: ${model}`);
        }

        const result = await (api.runtime.imageGeneration as any).generate({
          cfg: api.config,
          agentDir: api.resolvePath(""),
          prompt: enhancedPrompt,
          modelOverride: model,
          count,
          size,
          resolution,
        });

        const imageSummary = result.images.map((img: any, idx: number) => {
          const sizeBytes = img.buffer.length;
          const sizeKB = (sizeBytes / 1024).toFixed(2);
          return `[${idx + 1}] ${img.mimeType}, ${sizeKB} KB${img.fileName ? ` (${img.fileName})` : ""}`;
        }).join("\n");

        console.log(
          `[Secretary:ImageGen] ✅ Generated ${result.images.length} image(s) using ${result.provider}/${result.model}`
        );

        return {
          content: [
            {
              type: "text",
              text: `🎨 Generated ${result.images.length} image(s) using ${result.provider}/${result.model}\n\n${imageSummary}`,
            },
            ...result.images.map((img: any) => ({
              type: "image" as const,
              image: img.buffer.toString("base64"),
              mimeType: img.mimeType,
            })),
          ],
          details: {
            provider: result.provider,
            model: result.model,
            imageCount: result.images.length,
            prompt: enhancedPrompt,
            revisedPrompt: result.images[0]?.revisedPrompt,
            metadata: result.metadata,
            attempts: result.attempts,
          },
        };
      } catch (error) {
        console.error(`[Secretary:ImageGen] ❌ Image generation failed: ${error}`);
        return {
          content: [
            {
              type: "text",
              text: `❌ Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  };
  api.registerTool(tool as any);
  return tool;
}