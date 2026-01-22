# 架构对比图

## 一、当前架构（Provider 模式）

```mermaid
graph TB
    subgraph 开发者代码
        App[开发者应用]
    end

    subgraph LLMConfigProvider
        Context[LLMConfigContext]
        State[config state]
        Methods[updateConfig, resetConfig, validateConfig, getProviderConfig, getAvailableModels]
    end

    subgraph 组件层
        Form[LLMConfigForm]
        Field[FormField]
    end

    App --> Provider
    Provider --> Context
    Context --> Form
    Context --> Field
    State --> Context
    Methods --> Context

    style Provider fill:#f9f,stroke:#333,stroke-width:2px
    style Context fill:#bbf,stroke:#333,stroke-width:2px
```

### 数据流向

```mermaid
sequenceDiagram
    participant User as 用户
    participant Field as FormField
    participant Context as LLMConfigContext
    participant Provider as LLMConfigProvider
    participant App as 开发者应用

    User->>Field: 输入值
    Field->>Context: updateConfig(newValue)
    Context->>Provider: 更新 state
    Provider->>App: onConfigChange(updatedConfig)
    Provider->>Context: 重新渲染
    Context->>Field: 新的 config
    Context->>Form: 新的 config
```

### 职责分配

| 组件 | 职责 |
|------|------|
| **LLMConfigProvider** | 状态管理、验证逻辑、Provider 配置 |
| **LLMConfigForm** | 表单布局、字段验证、提交处理 |
| **FormField** | 字段渲染、值更新 |
| **开发者应用** | 使用组件，通过回调接收变化 |

---

## 二、目标架构（受控模式）

```mermaid
graph TB
    subgraph 开发者代码
        App[开发者应用]
        State[config state]
        Handlers[onChange, onSubmit, onReset]
    end

    subgraph 组件层
        Form[LLMConfigForm]
        Field[FormField]
    end

    State --> Form
    Handlers --> Form
    Form --> Field
    Field --> Handlers

    style App fill:#f9f,stroke:#333,stroke-width:2px
    style State fill:#bbf,stroke:#333,stroke-width:2px
```

### 数据流向

```mermaid
sequenceDiagram
    participant User as 用户
    participant Field as FormField
    participant Form as LLMConfigForm
    participant App as 开发者应用
    participant State as config state

    User->>Field: 输入值
    Field->>Form: onChange(newValue)
    Form->>App: onChange(updatedConfig)
    App->>State: 更新 state
    State->>App: 重新渲染
    App->>Form: 传递新的 value
    Form->>Field: 传递新的 value
```

### 职责分配

| 组件 | 职责 |
|------|------|
| **开发者应用** | 状态管理、事件处理、业务逻辑 |
| **LLMConfigForm** | 表单布局、字段验证、提交处理、值传递 |
| **FormField** | 字段渲染、值更新 |

---

## 三、组件接口对比

### LLMConfigForm Props 对比

#### 当前（Provider 模式）

```typescript
interface LLMConfigFormProps {
  config: FormConfig;
  onSubmit?: (config: LLMConfig) => void | Promise<void>;
  onReset?: () => void;
  validateOnSubmit?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  showSubmitButton?: boolean;
  showResetButton?: boolean;
  className?: string;
  progressive?: boolean;
}
```

#### 目标（受控模式）

```typescript
interface LLMConfigFormProps {
  config: FormConfig;
  value: LLMConfig;                    // 新增：受控值
  onChange?: (config: LLMConfig) => void;  // 新增：值更新回调
  providers?: ProviderConfig[];        // 新增：提供商配置
  validate?: (config: LLMConfig) => ValidationResult;  // 新增：验证函数
  onSubmit?: (config: LLMConfig) => void | Promise<void>;
  onReset?: () => void;
  validateOnSubmit?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  showSubmitButton?: boolean;
  showResetButton?: boolean;
  className?: string;
  progressive?: boolean;
}
```

### FormField Props 对比

#### 当前（Provider 模式）

```typescript
interface FormFieldProps {
  config: FieldConfig;
  error?: string;
}

// 内部使用 Context
const { config, updateConfig } = useLLMConfig();
```

#### 目标（受控模式）

```typescript
interface FormFieldProps {
  config: FieldConfig;
  error?: string;
  value: unknown;                      // 新增：字段值
  onChange: (value: unknown) => void;  // 新增：值更新回调
  fullConfig: LLMConfig;               // 新增：完整配置
}
```

---

## 四、使用方式对比

### 当前（Provider 模式）

```tsx
function MyComponent() {
  const handleSubmit = (config) => {
    console.log('提交:', config);
  };

  return (
    <LLMConfigProvider
      defaultConfig={initialConfig}
      onConfigChange={(config) => console.log('变化:', config)}
    >
      <LLMConfigForm
        config={formConfig}
        onSubmit={handleSubmit}
      />
    </LLMConfigProvider>
  );
}
```

### 目标（受控模式）

```tsx
function MyComponent() {
  const [config, setConfig] = useState(initialConfig);

  const handleSubmit = (finalConfig) => {
    console.log('提交:', finalConfig);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <LLMConfigForm
      config={formConfig}
      value={config}
      onChange={setConfig}
      onSubmit={handleSubmit}
      onReset={handleReset}
    />
  );
}
```

---

## 五、状态管理对比

### 当前（Provider 模式）

```mermaid
stateDiagram-v2
    [*] --> 初始化: Provider 挂载
    初始化 --> 等待输入: 设置默认配置
    等待输入 --> 更新中: 用户输入
    更新中 --> 等待输入: updateConfig()
    更新中 --> 触发回调: onConfigChange
    触发回调 --> 等待输入
    等待输入 --> 提交中: 用户提交
    提交中 --> 等待输入: onSubmit
    等待输入 --> 重置中: 用户重置
    重置中 --> 等待输入: resetConfig()
```

### 目标（受控模式）

```mermaid
stateDiagram-v2
    [*] --> 初始化: 组件挂载
    初始化 --> 等待输入: 设置初始 state
    等待输入 --> 更新中: 用户输入
    更新中 --> 等待输入: onChange + setState
    更新中 --> 重新渲染: state 变化
    重新渲染 --> 等待输入: 传递新的 value
    等待输入 --> 提交中: 用户提交
    提交中 --> 等待输入: onSubmit
    等待输入 --> 重置中: 用户重置
    重置中 --> 等待输入: onReset + setState
```

---

## 六、依赖关系对比

### 当前（Provider 模式）

```
开发者应用
    ↓
LLMConfigProvider (管理状态)
    ↓
LLMConfigContext (提供状态)
    ↓
LLMConfigForm (使用 Context)
    ↓
FormField (使用 Context)
```

### 目标（受控模式）

```
开发者应用 (管理状态)
    ↓ (value, onChange)
LLMConfigForm (传递 props)
    ↓ (value, onChange, fullConfig)
FormField (使用 props)
```

---

## 七、优势对比

| 方面 | Provider 模式 | 受控模式 |
|------|--------------|---------|
| **职责分离** | ❌ Provider 承担过多职责 | ✅ 组件职责清晰 |
| **状态控制** | ❌ 状态封装在 Provider 内 | ✅ 开发者完全控制 |
| **灵活性** | ❌ 难以自定义状态逻辑 | ✅ 可自由实现复杂逻辑 |
| **测试性** | ⚠️ 需要模拟 Context | ✅ 纯函数组件，易测试 |
| **集成性** | ❌ 难以与其他状态管理集成 | ✅ 易于集成 Redux/Zustand 等 |
| **学习成本** | ✅ 简单易用 | ⚠️ 需要管理状态 |
| **代码量** | ✅ 开发者代码少 | ⚠️ 需要写更多状态管理代码 |

---

## 八、迁移路径

```mermaid
graph LR
    A[当前架构] --> B[步骤1: 修改类型定义]
    B --> C[步骤2: 重构 LLMConfigForm]
    C --> D[步骤3: 重构 FormField]
    D --> E[步骤4: 更新导出]
    E --> F[步骤5: 更新示例代码]
    F --> G[目标架构]

    style A fill:#f99,stroke:#333,stroke-width:2px
    style G fill:#9f9,stroke:#333,stroke-width:2px
```

---

## 九、总结

### 核心变化

1. **状态管理位置**
   - 从 Provider 内部 → 开发者应用

2. **数据传递方式**
   - 从 Context API → Props 传递

3. **组件职责**
   - 从"非受控" → "受控"

4. **控制力**
   - 从组件内部控制 → 开发者完全控制

### 设计原则

- **单一职责原则**：组件只负责表单渲染和验证
- **受控组件模式**：遵循 React 最佳实践
- **开发者友好**：提供最大的灵活性
- **向后兼容**：提供清晰的迁移路径
