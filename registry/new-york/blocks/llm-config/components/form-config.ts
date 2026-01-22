import type { ReactNode } from "react";
import type { LLMConfig } from "./types";

/**
 * 字段类型枚举
 */
export type FieldType =
  | "select"
  | "text"
  | "password"
  | "number"
  | "range"
  | "custom";

/**
 * 基础字段配置接口
 */
export interface BaseFieldConfig {
  /** 字段名称，对应 LLMConfig 的属性 */
  name: keyof LLMConfig;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: FieldType;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否必填 */
  required?: boolean | ((config: LLMConfig) => boolean);
  /** 是否禁用 */
  disabled?: boolean | ((config: LLMConfig) => boolean);
  /** 是否可见 */
  visible?: boolean | ((config: LLMConfig) => boolean);
  /** 自定义验证函数 */
  validate?: (value: unknown, config: LLMConfig) => string | null;
  /** 自定义类名 */
  className?: string;
  /** 字段描述 */
  description?: string;
}

/**
 * 选择框字段配置
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  /** 选项列表，可以是静态数组或动态函数 */
  options:
    | Array<{ label: string; value: string }>
    | ((config: LLMConfig) => Array<{ label: string; value: string }>);
}

/**
 * 文本/密码字段配置
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "password";
  /** 是否显示密码切换按钮（仅password类型） */
  showPasswordToggle?: boolean;
}

/**
 * 数字字段配置
 */
export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 是否显示当前值 */
  showValue?: boolean;
}

/**
 * 范围滑块字段配置
 */
export interface RangeFieldConfig extends BaseFieldConfig {
  type: "range";
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step: number;
  /** 是否显示当前值 */
  showValue?: boolean;
  /** 值显示格式化函数 */
  formatValue?: (value: number) => string;
}

/**
 * 自定义字段渲染属性
 */
export interface CustomFieldRenderProps {
  /** 当前值 */
  value: unknown;
  /** 更新值的回调 */
  onChange: (value: unknown) => void;
  /** 错误信息 */
  error?: string;
  /** 是否禁用 */
  disabled: boolean;
  /** 完整的配置对象 */
  config: LLMConfig;
}

/**
 * 自定义字段配置
 */
export interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom";
  /** 自定义渲染函数 */
  render: (props: CustomFieldRenderProps) => ReactNode;
}

/**
 * 字段配置联合类型
 */
export type FieldConfig =
  | SelectFieldConfig
  | TextFieldConfig
  | NumberFieldConfig
  | RangeFieldConfig
  | CustomFieldConfig;

/**
 * 字段分组配置
 */
export interface FieldGroup {
  /** 分组标题 */
  title?: string;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认是否展开 */
  defaultOpen?: boolean;
  /** 分组内的字段列表 */
  fields: FieldConfig[];
  /** 分组自定义类名 */
  className?: string;
}

/**
 * 表单配置
 */
export interface FormConfig {
  /** 字段分组列表 */
  groups: FieldGroup[];
  /** 表单自定义类名 */
  className?: string;
}

/**
 * 表单提交属性
 */
export interface FormSubmitProps {
  /** 提交按钮文本 */
  submitButtonText?: string;
  /** 重置按钮文本 */
  resetButtonText?: string;
  /** 是否显示提交按钮 */
  showSubmitButton?: boolean;
  /** 是否显示重置按钮 */
  showResetButton?: boolean;
  /** 是否在提交时验证 */
  validateOnSubmit?: boolean;
}

/**
 * 完整的LLM配置表单属性
 */
export interface LLMConfigFormProps extends FormSubmitProps {
  /** 表单配置 */
  config: FormConfig;
  /** 提交回调 */
  onSubmit?: (config: LLMConfig) => void | Promise<void>;
  /** 重置回调 */
  onReset?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 是否启用渐进式表单（根据provider选择显示字段） */
  progressive?: boolean;
}
