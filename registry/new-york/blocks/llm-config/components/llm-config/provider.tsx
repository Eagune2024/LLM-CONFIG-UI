"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  LLMConfig,
  ProviderConfig,
  ValidationResult,
  LLMConfigContextValue,
} from "./types";
import { DEFAULT_PROVIDERS, DEFAULT_CONFIG } from "@/lib/providers";

const LLMConfigContext = createContext<LLMConfigContextValue | undefined>(
  undefined,
);

export interface LLMConfigProviderProps {
  children: React.ReactNode;
  defaultConfig?: Partial<LLMConfig>;
  providers?: ProviderConfig[];
  onConfigChange?: (config: LLMConfig) => void;
  validate?: (config: LLMConfig) => ValidationResult;
}

export function LLMConfigProvider({
  children,
  defaultConfig,
  providers = DEFAULT_PROVIDERS,
  onConfigChange,
  validate,
}: LLMConfigProviderProps) {
  const [config, setConfig] = useState<LLMConfig>({
    ...DEFAULT_CONFIG,
    ...defaultConfig,
  });

  const updateConfig = useCallback(
    (newConfig: Partial<LLMConfig>) => {
      setConfig((prev) => {
        const updated = { ...prev, ...newConfig };
        onConfigChange?.(updated);
        return updated;
      });
    },
    [onConfigChange],
  );

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG, ...defaultConfig });
  }, [defaultConfig]);

  const validateConfig = useCallback((): ValidationResult => {
    if (validate) {
      return validate(config);
    }

    const errors: Record<string, string> = {};

    if (!config.provider) {
      errors.provider = "请选择提供商";
    }

    if (!config.apiKey) {
      errors.apiKey = "请输入 API Key";
    }

    if (!config.model) {
      errors.model = "请选择模型";
    }

    // 提供商特定验证
    if (config.provider === "azure-openai") {
      if (!config.azureDeploymentName) {
        errors.azureDeploymentName = "请输入部署名称";
      }
      if (!config.azureApiVersion) {
        errors.azureApiVersion = "请选择 API 版本";
      }
    }

    return Object.keys(errors).length === 0 ? true : { valid: false, errors };
  }, [config, validate]);

  const getProviderConfig = useCallback((): ProviderConfig => {
    return providers.find((p) => p.id === config.provider) || providers[0];
  }, [config.provider, providers]);

  const getAvailableModels = useCallback(() => {
    const provider = getProviderConfig();
    return provider.models;
  }, [getProviderConfig]);

  const value: LLMConfigContextValue = useMemo(
    () => ({
      config,
      updateConfig,
      resetConfig,
      validateConfig,
      getProviderConfig,
      getAvailableModels,
    }),
    [
      config,
      updateConfig,
      resetConfig,
      validateConfig,
      getProviderConfig,
      getAvailableModels,
    ],
  );

  return (
    <LLMConfigContext.Provider value={value}>
      {children}
    </LLMConfigContext.Provider>
  );
}

export function useLLMConfig() {
  const context = useContext(LLMConfigContext);
  if (context === undefined) {
    throw new Error("useLLMConfig must be used within a LLMConfigProvider");
  }
  return context;
}
