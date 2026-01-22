import type { ProviderConfig } from "@/registry/new-york/blocks/llm-config/components/llm-config/types";

export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "openai",
    displayName: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    models: [
      { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai" },
    ],
  },
  {
    id: "anthropic",
    name: "anthropic",
    displayName: "Anthropic",
    baseURL: "https://api.anthropic.com/v1",
    models: [
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        provider: "anthropic",
      },
      {
        id: "claude-3-5-haiku-20241022",
        name: "Claude 3.5 Haiku",
        provider: "anthropic",
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        provider: "anthropic",
      },
    ],
  },
  {
    id: "azure-openai",
    name: "azure-openai",
    displayName: "Azure OpenAI",
    fields: [
      {
        name: "azureDeploymentName",
        label: "部署名称",
        type: "text",
        required: true,
      },
      {
        name: "azureApiVersion",
        label: "API 版本",
        type: "select",
        required: true,
        options: [
          { label: "2024-02-15-preview", value: "2024-02-15-preview" },
          { label: "2024-04-01-preview", value: "2024-04-01-preview" },
        ],
      },
    ],
    models: [
      { id: "gpt-4", name: "GPT-4", provider: "azure-openai" },
      { id: "gpt-35-turbo", name: "GPT-3.5 Turbo", provider: "azure-openai" },
    ],
  },
  {
    id: "google",
    name: "google",
    displayName: "Google",
    baseURL: "https://generativelanguage.googleapis.com/v1",
    models: [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
      { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro", provider: "google" },
    ],
  },
  {
    id: "cohere",
    name: "cohere",
    displayName: "Cohere",
    baseURL: "https://api.cohere.ai/v1",
    models: [
      { id: "command-r-plus", name: "Command R+", provider: "cohere" },
      { id: "command-r", name: "Command R", provider: "cohere" },
      { id: "command", name: "Command", provider: "cohere" },
    ],
  },
  {
    id: "ollama",
    name: "ollama",
    displayName: "Ollama",
    baseURL: "http://localhost:11434/v1",
    models: [
      { id: "llama3", name: "Llama 3", provider: "ollama" },
      { id: "llama2", name: "Llama 2", provider: "ollama" },
      { id: "mistral", name: "Mistral", provider: "ollama" },
    ],
  },
];

export const DEFAULT_CONFIG = {
  provider: "openai" as const,
  apiKey: "",
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 2048,
};
