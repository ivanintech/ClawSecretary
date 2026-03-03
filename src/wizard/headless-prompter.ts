import type { WizardProgress, WizardPrompter, WizardSelectParams, WizardMultiSelectParams, WizardTextParams, WizardConfirmParams } from "./prompts.js";

/**
 * A prompter that never asks for input and always returns the initial/default value.
 * Used for headless/non-interactive onboarding where we want to reuse interactive flows.
 */
export function createHeadlessPrompter(): WizardPrompter {
  return {
    intro: async () => {},
    outro: async () => {},
    note: async () => {},
    select: async <T>(params: WizardSelectParams<T>) => {
      if (params.initialValue !== undefined) {
        return params.initialValue;
      }
      if (params.options.length > 0) {
        return params.options[0].value;
      }
      throw new Error(`HeadlessPrompter: select "${params.message}" has no options or initialValue`);
    },
    multiselect: async <T>(params: WizardMultiSelectParams<T>) => {
      return params.initialValues ?? [];
    },
    text: async (params: WizardTextParams) => {
      return params.initialValue ?? "";
    },
    confirm: async (params: WizardConfirmParams) => {
      return params.initialValue ?? true;
    },
    progress: () => ({
      update: () => {},
      stop: () => {},
    }),
  };
}
