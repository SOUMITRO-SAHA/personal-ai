import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { IGeneralAiProvider } from "@/core/types/aiProvider";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { idbStorage } from "..";

const DEFAULT_MAX_TOKENS = "2048";

// Store interface
interface ApiConfigState extends IApiConfig {
  // Getters
  getConfig: (type: EAiProvider) => IGeneralAiProvider[];

  // Actions
  setConfig: (config: IApiConfig) => void;
  addConfig: (type: EAiProvider, provider: IGeneralAiProvider) => void;
  updateConfig: (
    type: EAiProvider,
    index: number,
    apikey: string,
    variant: string
  ) => void;
  deleteConfig: (type: EAiProvider, index: number) => void;
  updateProvider: (
    type: EAiProvider,
    index: number,
    updatedProvider: Partial<IGeneralAiProvider>
  ) => void;
  deleteProvider: (type: EAiProvider, index: number) => void;
  setModel: (model: EAiProvider) => void;
  setVariant: (variant: string) => void;
}

export const useApiConfigStore = create<ApiConfigState>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== State ===== //
        anthropicConfigs: [],
        geminiConfigs: [],
        openaiConfigs: [],
        ollamaConfigs: [],
        localConfigs: [],
        model: EAiProvider.LOCAL,
        variant: "",

        // ===== Getters ===== //
        getConfig: (type) => {
          const configMap: Record<EAiProvider, IGeneralAiProvider[]> = {
            [EAiProvider.ANTHROPIC]: get().anthropicConfigs,
            [EAiProvider.GEMINI]: get().geminiConfigs,
            [EAiProvider.OPENAI]: get().openaiConfigs,
            [EAiProvider.OLLAMA]: get().ollamaConfigs,
            [EAiProvider.LOCAL]: get().localConfigs,
            [EAiProvider.GREPTILE]: [],
          };

          if (!configMap[type]) {
            throw new Error(`Invalid config type: ${type}`);
          }
          return configMap[type];
        },

        // ===== Actions ===== //
        setConfig: (config) =>
          set(() => ({
            anthropicConfigs: addDefaultTokens(config.anthropicConfigs),
            geminiConfigs: addDefaultTokens(config.geminiConfigs),
            openaiConfigs: addDefaultTokens(config.openaiConfigs),
            ollamaConfigs: addDefaultTokens(config.ollamaConfigs),
            localConfigs: addDefaultTokens(config.localConfigs),
            model: config.model ?? EAiProvider.LOCAL,
            variant: config.variant ?? "",
          })),

        addConfig: (type, provider) =>
          set((state) => ({
            [`${type}Configs`]: [...state.getConfig(type), provider],
          })),

        updateConfig: (type, index, apikey, variant) =>
          set((state) => {
            const configs = [...state.getConfig(type)];
            if (!configs[index]) {
              throw new Error(
                `Invalid config index: ${index} for type: ${type}`
              );
            }
            configs[index] = { ...configs[index], apikey, variant };
            return { [`${type}Configs`]: configs };
          }),

        deleteConfig: (type, index) =>
          set((state) => {
            const configs = [...state.getConfig(type)];
            if (!configs[index]) {
              throw new Error(
                `Invalid config index: ${index} for type: ${type}`
              );
            }
            configs.splice(index, 1);
            return { [`${type}Configs`]: configs };
          }),

        updateProvider: (type, index, updatedProvider) =>
          set((state) => {
            const configs = [...state.getConfig(type)];
            if (!configs[index]) {
              throw new Error(
                `Invalid provider index: ${index} for type: ${type}`
              );
            }
            configs[index] = { ...configs[index], ...updatedProvider };
            return { [`${type}Configs`]: configs };
          }),

        deleteProvider: (type, index) =>
          set((state) => {
            const configs = [...state.getConfig(type)];
            if (!configs[index]) {
              throw new Error(
                `Invalid provider index: ${index} for type: ${type}`
              );
            }
            configs.splice(index, 1);
            return { [`${type}Configs`]: configs };
          }),

        setModel: (model) => set(() => ({ model })),
        setVariant: (variant) => set(() => ({ variant })),
      }),
      {
        name: "api-config-store",
        storage: idbStorage(),
        partialize: (state) => ({
          anthropicConfigs: state.anthropicConfigs,
          geminiConfigs: state.geminiConfigs,
          openaiConfigs: state.openaiConfigs,
          ollamaConfigs: state.ollamaConfigs,
          localConfigs: state.localConfigs,
          model: state.model,
          variant: state.variant,
        }),
      }
    ),
    { name: "ApiConfigStore", anonymousActionType: "ApiConfigStore" }
  )
);

// Utility function to add default tokens
function addDefaultTokens(
  providers?: IGeneralAiProvider[]
): IGeneralAiProvider[] {
  return (
    providers?.map((provider) => ({
      ...provider,
      maxTokens: provider.maxTokens || DEFAULT_MAX_TOKENS,
    })) ?? []
  );
}
