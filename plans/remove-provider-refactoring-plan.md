# 移除 LLMConfigProvider 重构方案

## 一、当前架构分析

### 1.1 LLMConfigProvider 的职责

当前 `LLMConfigProvider` 承担了以下职责：

| 职责 | 方法/属性 | 说明 |
|------|-----------|------|
| **状态管理** | `config` state | 管理全局配置状态 |
| **状态更新** | `updateConfig()` | 更新配置并触发回调 |
| **重置功能** | `resetConfig()` | 重置为默认配置 |
| **验证功能** | `validateConfig()` | 验证配置完整性 |
| **Provider 配置** | `getProviderConfig()` | 获取当前提供商配置 |
| **模型列表** | `getAvailableModels()` | 获取可用模型列表 |

### 1.2 依赖 Provider 的组件

| 组件 | 使用的 Context 方法 |
|------|-------------------|
| `LLMConfigForm` | `config`, `resetConfig`, `validateConfig` |
| `FormField` | `config`, `updateConfig` |

### 1.3 当前使用方式

```tsx
<LLMConfigProvider>
  <LLMConfigForm config={defaultLLMFormConfig} />
</LLMConfigProvider>
```

## 二、重构方案设计

### 2.1 核心设计理念

**将组件从"非受控"转换为"受控"模式**

- **当前模式**：Provider 内部管理状态，子组件通过 Context 访问
- **目标模式**：通过 props 传递状态和回调，由开发者管理全局状态

### 2.2 新的组件接口设计

#### 2.2.1 LLMConfigForm Props

```typescript
interface LLMConfigFormProps {
  // === 表单配置 ===
  config: FormConfig;

  // === 受控状态 ===
  value: LLMConfig;           // 当前配置值
  onChange?: (config: LLMConfig) => void;  // 配置更新回调

  // === 提供商配置 ===
  providers?: ProviderConfig[];  // 提供商列表（可选，默认使用 DEFAULT_PROVIDERS）

  // === 验证 ===
  validate?: (config: LLMConfig) => ValidationResult;  // 自定义验证函数

  // === 事件回调 ===
  onSubmit?: (config: LLMConfig) => void | Promise<void>;
  onReset?: () => void;

  // === UI 控制 ===
  submitButtonText?: string;
  resetButtonText?: string;
  showSubmitButton?: boolean;
  showResetButton?: boolean;
  validateOnSubmit?: boolean;
  className?: string;
  progressive?: boolean;
}
```

#### 2.2.2 FormField Props

```typescript
interface FormFieldProps {
  config: FieldConfig;
  error?: string;
  value: unknown;              // 字段当前值
  onChange: (value: unknown) => void;  // 字段更新回调
  fullConfig: LLMConfig;       // 完整配置对象（用于条件判断）
}
```

### 2.3 新的使用方式

```tsx
// 开发者管理状态
function MyComponent() {
  const [config, setConfig] = useState<LLMConfig>(DEFAULT_CONFIG);

  const handleConfigChange = (newConfig: LLMConfig) => {
    setConfig(newConfig);
  };

  const handleSubmit = (finalConfig: LLMConfig) => {
    console.log('提交配置:', finalConfig);
  };

  return (
    <LLMConfigForm
      config={defaultLLMFormConfig}
      value={config}
      onChange={handleConfigChange}
      onSubmit={handleSubmit}
    />
  );
}
```

## 三、重构步骤

### 3.1 修改类型定义

**文件**: `registry/new-york/blocks/llm-config/components/form-config.ts`

```typescript
// 更新 LLMConfigFormProps 接口
export interface LLMConfigFormProps extends FormSubmitProps {
  /** 表单配置 */
  config: FormConfig;

  /** 当前配置值（受控） */
  value: LLMConfig;

  /** 配置更新回调 */
  onChange?: (config: LLMConfig) => void;

  /** 提供商配置列表 */
  providers?: ProviderConfig[];

  /** 自定义验证函数 */
  validate?: (config: LLMConfig) => ValidationResult;

  /** 提交回调 */
  onSubmit?: (config: LLMConfig) => void | Promise<void>;

  /** 重置回调 */
  onReset?: () => void;

  /** 自定义类名 */
  className?: string;

  /** 是否启用渐进式表单 */
  progressive?: boolean;
}
```

### 3.2 重构 LLMConfigForm 组件

**文件**: `registry/new-york/blocks/llm-config/components/llm-config-form.tsx`

**主要变更**：

1. **移除 Context 依赖**
   ```tsx
   // 删除
   import { useLLMConfig } from "./provider";

   // 使用 props 替代
   const { value, onChange, providers = DEFAULT_PROVIDERS, validate } = props;
   ```

2. **实现状态更新逻辑**
   ```tsx
   const handleFieldChange = (fieldName: keyof LLMConfig, fieldValue: unknown) => {
     const newConfig = { ...value, [fieldName]: fieldValue };
     onChange?.(newConfig);
   };
   ```

3. **实现验证逻辑**
   ```tsx
   const validateConfig = (): ValidationResult => {
     if (validate) {
       return validate(value);
     }

     // 默认验证逻辑（从 Provider 迁移）
     const errors: Record<string, string> = {};

     if (!value.provider) {
       errors.provider = "请选择提供商";
     }

     if (!value.apiKey) {
       errors.apiKey = "请输入 API Key";
     }

     if (!value.model) {
       errors.model = "请选择模型";
     }

     // Azure 特定验证
     if (value.provider === "azure-openai") {
       if (!value.azureDeploymentName) {
         errors.azureDeploymentName = "请输入部署名称";
       }
       if (!value.azureApiVersion) {
         errors.azureApiVersion = "请选择 API 版本";
       }
     }

     return Object.keys(errors).length === 0 ? true : { valid: false, errors };
   };
   ```

4. **传递 props 到 FormField**
   ```tsx
   <FormField
     config={field}
     error={errors[field.name as string]}
     value={value[field.name]}
     onChange={(newValue) => handleFieldChange(field.name, newValue)}
     fullConfig={value}
   />
   ```

### 3.3 重构 FormField 组件

**文件**: `registry/new-york/blocks/llm-config/components/form-field.tsx`

**主要变更**：

1. **移除 Context 依赖**
   ```tsx
   // 删除
   import { useLLMConfig } from "./provider";

   // 使用 props 替代
   interface FormFieldProps {
     config: FieldConfig;
     error?: string;
     value: unknown;
     onChange: (value: unknown) => void;
     fullConfig: LLMConfig;
   }
   ```

2. **更新所有子组件的 props**
   ```tsx
   // 例如 SelectField
   function SelectField({
     config,
     value,
     onChange,
     error,
     disabled,
     fullConfig,  // 替代 llmConfig
   }: {
     config: FieldConfig;
     value: unknown;
     onChange: (value: unknown) => void;
     error?: string;
     disabled: boolean;
     fullConfig: LLMConfig;
   }) {
     // 使用 fullConfig 替代 llmConfig
     const options =
       typeof config.options === "function"
         ? config.options(fullConfig)
         : config.options;
     // ...
   }
   ```

### 3.4 更新导出

**文件**: `registry/new-york/blocks/llm-config/components/index.ts`

```typescript
// 移除 Provider 相关导出
// export { LLMConfigProvider, useLLMConfig } from "./provider";

// 保留其他导出
export { LLMConfigForm } from "./llm-config-form";
export { FormField } from "./form-field";

// 类型导出
export type {
  LLMProvider,
  LLMModel,
  LLMConfig,
  ProviderConfig,
  ProviderField,
  ValidationResult,
  // 移除 LLMConfigContextValue
} from "./types";

export type {
  FieldType,
  BaseFieldConfig,
  SelectFieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  RangeFieldConfig,
  CustomFieldConfig,
  FieldConfig,
  FieldGroup,
  FormConfig,
  FormSubmitProps,
  LLMConfigFormProps,
  CustomFieldRenderProps,
} from "./form-config";
```

### 3.5 更新示例代码

**文件**: `app/page.tsx`

```tsx
"use client";

import * as React from "react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LLMConfigForm } from "@/registry/new-york/blocks/llm-config/components";
import { defaultLLMFormConfig } from "@/registry/new-york/blocks/llm-config/lib/default-form-config";
import { DEFAULT_CONFIG } from "@/registry/new-york/blocks/llm-config/lib/providers";

export default function Home() {
  const [config, setConfig] = React.useState(DEFAULT_CONFIG);

  const handleConfigChange = (newConfig: typeof config) => {
    setConfig(newConfig);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              LLM Configuration Form
            </h2>
            <OpenInV0Button name="llm-config" className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <LLMConfigForm
              config={defaultLLMFormConfig}
              value={config}
              onChange={handleConfigChange}
              showSubmitButton={false}
              showResetButton={false}
              progressive={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
```

## 四、迁移指南

### 4.1 从 Provider 模式迁移到受控模式

#### 迁移前

```tsx
<LLMConfigProvider
  defaultConfig={initialConfig}
  onConfigChange={handleChange}
>
  <LLMConfigForm config={formConfig} />
</LLMConfigProvider>
```

#### 迁移后

```tsx
const [config, setConfig] = useState(initialConfig);

<LLMConfigForm
  config={formConfig}
  value={config}
  onChange={setConfig}
/>
```

### 4.2 功能对比

| 功能 | Provider 模式 | 受控模式 |
|------|--------------|---------|
| 状态管理 | Provider 内部 | 开发者管理 |
| 状态更新 | `updateConfig()` | `onChange` prop |
| 重置功能 | `resetConfig()` | 开发者自己实现 |
| 验证功能 | `validateConfig()` | `validate` prop |
| Provider 配置 | Provider prop | `providers` prop |
| 模型列表 | `getAvailableModels()` | 通过 `providers` prop 获取 |

### 4.3 重置功能实现示例

```tsx
function MyComponent() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <LLMConfigForm
      config={formConfig}
      value={config}
      onChange={setConfig}
      onReset={handleReset}
      showResetButton={true}
    />
  );
}
```

## 五、优势与注意事项

### 5.1 优势

1. **职责清晰**
   - 组件专注于表单渲染和验证
   - 状态管理交给开发者

2. **更好的控制力**
   - 开发者可以完全控制状态的生命周期
   - 更容易与其他状态管理方案集成

3. **更灵活的使用方式**
   - 可以轻松实现复杂的状态逻辑
   - 支持自定义验证和数据处理

4. **符合 React 最佳实践**
   - 受控组件模式是 React 推荐的模式
   - 更容易测试和维护

### 5.2 注意事项

1. **状态管理复杂度**
   - 开发者需要自己管理状态
   - 需要处理异步更新等问题

2. **向后兼容性**
   - 需要更新所有使用 Provider 的代码
   - 建议提供迁移文档

3. **可选功能**
   - 如果开发者不提供 `onChange`，表单将变为只读模式
   - 需要在文档中明确说明

## 六、后续优化建议

### 6.1 提供辅助 Hook

可以提供一个辅助 hook 来简化常用场景：

```typescript
// hooks/use-llm-config.ts
export function useLLMConfig(initialConfig = DEFAULT_CONFIG) {
  const [config, setConfig] = useState(initialConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateConfig = useCallback((updates: Partial<LLMConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(initialConfig);
    setErrors({});
  }, [initialConfig]);

  return {
    config,
    updateConfig,
    resetConfig,
    errors,
    setErrors,
  };
}
```

### 6.2 提供预设组件

如果需要简化使用，可以提供预设组件：

```typescript
// components/llm-config-controlled.tsx
export function ControlledLLMConfigForm({
  initialConfig = DEFAULT_CONFIG,
  ...props
}: Omit<LLMConfigFormProps, 'value' | 'onChange'> & {
  initialConfig?: Partial<LLMConfig>;
}) {
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG, ...initialConfig });

  return (
    <LLMConfigForm
      {...props}
      value={config}
      onChange={setConfig}
    />
  );
}
```

## 七、总结

本方案通过将组件从非受控模式转换为受控模式，实现了以下目标：

1. ✅ 缩小组件职责，专注于表单渲染和验证
2. ✅ 将全局状态管理交给开发者
3. ✅ 移除 LLMConfigProvider，简化组件结构
4. ✅ 提供更灵活的使用方式
5. ✅ 符合 React 最佳实践

重构后的组件将更加轻量、灵活，同时保持了原有的功能完整性。
