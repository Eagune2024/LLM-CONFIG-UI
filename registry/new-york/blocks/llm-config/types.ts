import type { ReactNode } from "react";

export type LLMProvider =
  | "openai"
  | "anthropic"
  | "azure-openai"
  | "google"
  | "cohere"
  | "ollama"
  | "custom";

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProvider;
  contextLength?: number;
  inputPrice?: number;
  outputPrice?: number;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  // Azure 特定
  azureDeploymentName?: string;
  azureApiVersion?: string;
  // 自定义字段
  customFields?: Record<string, any>;
}

export interface ProviderConfig {
  id: LLMProvider;
  name: string;
  displayName: string;
  icon?: ReactNode;
  baseURL?: string;
  apiVersion?: string;
  models: LLMModel[];
  fields?: ProviderField[];
}

export interface ProviderField {
  name: string;
  label: string;
  type: "text" | "password" | "select" | "number";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export type ValidationResult =
  | boolean
  | { valid: boolean; errors?: Record<string, string> };

export interface LLMConfigContextValue {
  config: LLMConfig;
  updateConfig: (config: Partial<LLMConfig>) => void;
  resetConfig: () => void;
  validateConfig: () => ValidationResult;
  getProviderConfig: () => ProviderConfig;
  getAvailableModels: () => LLMModel[];
}
