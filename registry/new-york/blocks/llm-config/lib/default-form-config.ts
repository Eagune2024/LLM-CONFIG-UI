import type { FormConfig } from "../components/form-config";
import type { LLMProvider } from "../components/types";

/**
 * 默认的LLM配置表单配置
 */
export const defaultLLMFormConfig: FormConfig = {
  groups: [
    {
      title: "基础配置",
      fields: [
        {
          name: "provider",
          label: "API提供商",
          type: "select",
          required: true,
          options: [
            { label: "OpenAI", value: "openai" },
            { label: "Anthropic", value: "anthropic" },
            { label: "Azure OpenAI", value: "azure-openai" },
            { label: "Google", value: "google" },
            { label: "Cohere", value: "cohere" },
            { label: "Ollama", value: "ollama" },
            { label: "自定义", value: "custom" },
          ],
        },
        {
          name: "apiKey",
          label: "API Key",
          type: "password",
          required: true,
          placeholder: "输入你的 API Key",
          showPasswordToggle: true,
        },
        {
          name: "model",
          label: "选择模型",
          type: "select",
          required: true,
          disabled: (config) => !config.provider,
          placeholder: "请先选择提供商",
          options: (config) => {
            // 根据provider返回不同的模型列表
            const provider = config.provider as LLMProvider;
            const models: Record<
              LLMProvider,
              Array<{ label: string; value: string }>
            > = {
              openai: [
                { label: "GPT-4 Turbo", value: "gpt-4-turbo-preview" },
                { label: "GPT-4", value: "gpt-4" },
                { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
              ],
              anthropic: [
                { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
                { label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
                { label: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
              ],
              "azure-openai": [
                { label: "GPT-4", value: "gpt-4" },
                { label: "GPT-3.5 Turbo", value: "gpt-35-turbo" },
              ],
              google: [
                { label: "Gemini Pro", value: "gemini-pro" },
                { label: "Gemini Pro Vision", value: "gemini-pro-vision" },
              ],
              cohere: [
                { label: "Command R+", value: "command-r-plus" },
                { label: "Command R", value: "command-r" },
              ],
              ollama: [
                { label: "Llama 2", value: "llama2" },
                { label: "Mistral", value: "mistral" },
              ],
              custom: [{ label: "自定义模型", value: "custom" }],
            };
            return models[provider] || [];
          },
        },
      ],
    },
    {
      title: "高级选项",
      collapsible: true,
      defaultOpen: true,
      fields: [
        {
          name: "baseURL",
          label: "Base URL",
          type: "text",
          placeholder: "自定义 Base URL（可选）",
          description: "覆盖默认的API端点URL",
        },
        {
          name: "temperature",
          label: "Temperature",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          showValue: true,
          description: "控制输出的随机性，值越高输出越随机",
        },
        {
          name: "maxTokens",
          label: "最大Token数",
          type: "number",
          min: 1,
          max: 128000,
          step: 1,
          placeholder: "例如: 4096",
          description: "限制模型生成的最大token数量",
        },
        {
          name: "topP",
          label: "Top P",
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          showValue: true,
          description: "核采样参数，控制词汇选择的多样性",
        },
        {
          name: "frequencyPenalty",
          label: "频率惩罚",
          type: "range",
          min: -2,
          max: 2,
          step: 0.1,
          showValue: true,
          description: "减少重复词汇的出现",
        },
        {
          name: "presencePenalty",
          label: "存在惩罚",
          type: "range",
          min: -2,
          max: 2,
          step: 0.1,
          showValue: true,
          description: "鼓励讨论新话题",
        },
        // Azure特定字段
        {
          name: "azureDeploymentName",
          label: "部署名称",
          type: "text",
          visible: (config) => config.provider === "azure-openai",
          required: (config) => config.provider === "azure-openai",
          placeholder: "Azure OpenAI部署名称",
        },
        {
          name: "azureApiVersion",
          label: "API 版本",
          type: "select",
          visible: (config) => config.provider === "azure-openai",
          required: (config) => config.provider === "azure-openai",
          options: [
            { label: "2024-02-15-preview", value: "2024-02-15-preview" },
            { label: "2024-01-01-preview", value: "2024-01-01-preview" },
            { label: "2023-12-01-preview", value: "2023-12-01-preview" },
          ],
        },
      ],
    },
  ],
};
