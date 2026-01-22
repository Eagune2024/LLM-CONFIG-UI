# LLM配置表单使用指南

## 概述

新的配置驱动的LLM配置表单通过声明式配置定义表单结构，相比旧的组件化方案具有以下优势：

- **更少的组件**：从8+个独立组件简化为1个通用FormField + 配置
- **更高的灵活性**：支持条件显示、字段依赖、动态选项等高级功能
- **更好的类型安全**：使用 keyof LLMConfig 确保字段名称的类型安全
- **更易维护**：添加新字段只需在配置中添加定义

## 快速开始

### 基础用法

```tsx
import {
  ConfigDrivenLLMConfigForm,
  LLMConfigProvider,
} from "@/registry/new-york/blocks/llm-config/components";
import { defaultLLMFormConfig } from "@/registry/new-york/blocks/llm-config/lib/default-form-config";

function App() {
  return (
    <LLMConfigProvider>
      <ConfigDrivenLLMConfigForm
        config={defaultLLMFormConfig}
        onSubmit={(config) => {
          console.log("提交配置:", config);
        }}
      />
    </LLMConfigProvider>
  );
}
```

### 自定义表单配置

```tsx
import type { FormConfig } from "@/registry/new-york/blocks/llm-config/components";

const customFormConfig: FormConfig = {
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
          ],
        },
        {
          name: "apiKey",
          label: "API Key",
          type: "password",
          required: true,
          placeholder: "输入你的 API Key",
        },
      ],
    },
    {
      title: "高级选项",
      collapsible: true,
      defaultOpen: true,
      fields: [
        {
          name: "temperature",
          label: "Temperature",
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          showValue: true,
        },
      ],
    },
  ],
};

function App() {
  return (
    <LLMConfigProvider>
      <ConfigDrivenLLMConfigForm config={customFormConfig} />
    </LLMConfigProvider>
  );
}
```

## 字段类型

### 1. 选择框 (select)

```tsx
{
  name: "provider",
  label: "API提供商",
  type: "select",
  required: true,
  options: [
    { label: "OpenAI", value: "openai" },
    { label: "Anthropic", value: "anthropic" },
  ],
  // 或者使用动态选项
  options: (config) => {
    return getOptionsBasedOnConfig(config);
  },
}
```

### 2. 文本输入 (text)

```tsx
{
  name: "baseURL",
  label: "Base URL",
  type: "text",
  placeholder: "自定义 Base URL（可选）",
  description: "覆盖默认的API端点URL",
}
```

### 3. 密码输入 (password)

```tsx
{
  name: "apiKey",
  label: "API Key",
  type: "password",
  required: true,
  placeholder: "输入你的 API Key",
  showPasswordToggle: true, // 显示密码切换按钮
}
```

### 4. 数字输入 (number)

```tsx
{
  name: "maxTokens",
  label: "最大Token数",
  type: "number",
  min: 1,
  max: 128000,
  step: 1,
  placeholder: "例如: 4096",
  showValue: true, // 显示当前值
}
```

### 5. 范围滑块 (range)

```tsx
{
  name: "temperature",
  label: "Temperature",
  type: "range",
  min: 0,
  max: 2,
  step: 0.1,
  showValue: true,
  formatValue: (value) => `${value.toFixed(1)}`, // 自定义值显示格式
}
```

### 6. 自定义字段 (custom)

```tsx
{
  name: "customField",
  label: "自定义字段",
  type: "custom",
  render: ({ value, onChange, error, disabled, config }) => (
    <CustomComponent
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      config={config}
    />
  ),
}
```

## 高级功能

### 条件显示

根据其他字段的值动态显示/隐藏字段：

```tsx
{
  name: "azureDeploymentName",
  label: "部署名称",
  type: "text",
  visible: (config) => config.provider === "azure-openai",
  required: (config) => config.provider === "azure-openai",
}
```

### 条件禁用

根据其他字段的值动态禁用字段：

```tsx
{
  name: "model",
  label: "选择模型",
  type: "select",
  disabled: (config) => !config.provider,
  placeholder: "请先选择提供商",
}
```

### 动态选项

根据配置动态生成选项列表：

```tsx
{
  name: "model",
  label: "选择模型",
  type: "select",
  options: (config) => {
    const provider = config.provider;
    const models: Record<string, Array<{ label: string; value: string }>> = {
      openai: [
        { label: "GPT-4", value: "gpt-4" },
        { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
      ],
      anthropic: [
        { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
        { label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
      ],
    };
    return models[provider] || [];
  },
}
```

### 自定义验证

为字段添加自定义验证逻辑：

```tsx
{
  name: "apiKey",
  label: "API Key",
  type: "password",
  required: true,
  validate: (value, config) => {
    if (value && value.length < 10) {
      return "API Key长度不能少于10个字符";
    }
    return null;
  },
}
```

### 渐进式表单

根据provider选择逐步显示字段：

```tsx
<ConfigDrivenLLMConfigForm
  config={formConfig}
  progressive={true} // 启用渐进式表单
/>
```

## 表单配置属性

### ConfigDrivenLLMConfigForm Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| config | FormConfig | - | 表单配置对象（必填） |
| onSubmit | (config: LLMConfig) => void \| Promise<void> | - | 提交回调 |
| onReset | () => void | - | 重置回调 |
| validateOnSubmit | boolean | true | 是否在提交时验证 |
| submitButtonText | string | "保存" | 提交按钮文本 |
| resetButtonText | string | "重置" | 重置按钮文本 |
| showSubmitButton | boolean | true | 是否显示提交按钮 |
| showResetButton | boolean | true | 是否显示重置按钮 |
| progressive | boolean | false | 是否启用渐进式表单 |
| className | string | - | 自定义类名 |

### 字段配置属性

所有字段类型都支持以下基础属性：

| 属性 | 类型 | 描述 |
|------|------|------|
| name | keyof LLMConfig | 字段名称（必填） |
| label | string | 字段标签（必填） |
| type | FieldType | 字段类型（必填） |
| placeholder | string | 占位符文本 |
| required | boolean \| (config: LLMConfig) => boolean | 是否必填 |
| disabled | boolean \| (config: LLMConfig) => boolean | 是否禁用 |
| visible | boolean \| (config: LLMConfig) => boolean | 是否可见 |
| validate | (value: unknown, config: LLMConfig) => string \| null | 自定义验证函数 |
| className | string | 自定义类名 |
| description | string | 字段描述 |

## 迁移指南

### 从旧组件迁移到新架构

**旧方式：**
```tsx
<LLMConfigForm>
  <ProviderSelector title="API提供商" />
  <AccessKeyInput label="API Key" placeholder="输入你的 API Key" />
  <ModelSelector title="选择模型" />
  <CollapsibleSection title="高级选项">
    <BaseUrlInput label="Base URL" placeholder="自定义 Base URL（可选）" />
    <TemperatureSlider label="Temperature" min={0} max={2} step={0.1} />
  </CollapsibleSection>
</LLMConfigForm>
```

**新方式：**
```tsx
<LLMConfigProvider>
  <ConfigDrivenLLMConfigForm config={defaultLLMFormConfig} />
</LLMConfigProvider>
```

### 保留旧组件（向后兼容）

如果需要保持向后兼容，可以继续使用旧组件：

```tsx
import {
  LLMConfigForm,
  ProviderSelector,
  AccessKeyInput,
  ModelSelector,
  CollapsibleSection,
  BaseUrlInput,
  TemperatureSlider,
} from "@/registry/new-york/blocks/llm-config/components";

// 继续使用旧组件
<LLMConfigForm>
  <ProviderSelector title="API提供商" />
  {/* ... */}
</LLMConfigForm>
```

## 最佳实践

1. **使用默认配置**：大多数情况下，使用 `defaultLLMFormConfig` 即可满足需求
2. **分组管理**：将相关字段分组，使用 `collapsible` 属性折叠不常用的选项
3. **类型安全**：使用 TypeScript 的类型推断确保字段名称正确
4. **渐进式表单**：对于复杂的表单，启用 `progressive` 模式提升用户体验
5. **自定义验证**：为关键字段添加自定义验证逻辑

## 示例项目

查看 [`app/page.tsx`](../app/page.tsx) 了解完整的使用示例。
