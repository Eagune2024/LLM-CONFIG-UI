"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import type { FieldConfig, CustomFieldRenderProps } from "./form-config";
import type { LLMConfig } from "./types";

interface FormFieldProps {
  config: FieldConfig;
  error?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  fullConfig: LLMConfig;
}

/**
 * 通用表单字段组件
 * 根据字段配置类型自动渲染对应的输入组件
 */
export function FormField({
  config,
  error,
  value,
  onChange,
  fullConfig,
}: FormFieldProps) {
  // 计算字段是否可见
  const isVisible =
    config.visible === undefined ||
    (typeof config.visible === "function"
      ? config.visible(fullConfig)
      : config.visible);

  // 计算字段是否禁用
  const isDisabled =
    config.disabled === undefined ||
    (typeof config.disabled === "function"
      ? config.disabled(fullConfig)
      : config.disabled);

  // 如果字段不可见，不渲染
  if (!isVisible) {
    return null;
  }

  // 根据字段类型渲染不同的组件
  switch (config.type) {
    case "select":
      return (
        <SelectField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={isDisabled}
          fullConfig={fullConfig}
        />
      );
    case "text":
    case "password":
      return (
        <TextField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={isDisabled}
        />
      );
    case "number":
      return (
        <NumberField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={isDisabled}
        />
      );
    case "range":
      return (
        <RangeField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={isDisabled}
        />
      );
    case "custom":
      return (
        <CustomField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={isDisabled}
          fullConfig={fullConfig}
        />
      );
    default:
      return null;
  }
}

/**
 * 选择框字段
 */
function SelectField({
  config,
  value,
  onChange,
  error,
  disabled,
  fullConfig,
}: {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
  fullConfig: LLMConfig;
}) {
  if (config.type !== "select") return null;

  // 获取选项列表
  const options =
    typeof config.options === "function"
      ? config.options(fullConfig)
      : config.options;

  return (
    <div className={cn("space-y-2", config.className)}>
      <Label>
        {config.label}
        {config.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={String(value ?? "")}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full",
          )}
        >
          <SelectValue
            placeholder={config.placeholder || `选择${config.label}`}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}

/**
 * 文本/密码字段
 */
function TextField({
  config,
  value,
  onChange,
  error,
  disabled,
}: {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
}) {
  // 将useState移到条件检查之前
  const [showPassword, setShowPassword] = useState(false);

  if (config.type !== "text" && config.type !== "password") return null;

  return (
    <div className={cn("space-y-2", config.className)}>
      <Label>
        {config.label}
        {config.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={
            config.type === "password" && !showPassword ? "password" : "text"
          }
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
          )}
          placeholder={config.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {config.type === "password" && config.showPasswordToggle !== false && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}

/**
 * 数字字段
 */
function NumberField({
  config,
  value,
  onChange,
  error,
  disabled,
}: {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
}) {
  if (config.type !== "number") return null;

  const numValue = value as number | undefined;
  const displayValue =
    numValue !== undefined && numValue !== null ? numValue : "";

  return (
    <div className={cn("space-y-2", config.className)}>
      <Label>
        {config.label}
        {config.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type="number"
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
        )}
        placeholder={config.placeholder}
        value={displayValue}
        min={config.min}
        max={config.max}
        step={config.step}
        onChange={(e) => {
          const num = parseFloat(e.target.value);
          onChange(isNaN(num) ? undefined : num);
        }}
        disabled={disabled}
      />
      {config.showValue && numValue !== undefined && numValue !== null && (
        <p className="text-sm text-muted-foreground">当前值: {numValue}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}

/**
 * 范围滑块字段
 */
function RangeField({
  config,
  value,
  onChange,
  error,
  disabled,
}: {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
}) {
  if (config.type !== "range") return null;

  const numValue = value as number | undefined;
  const displayValue =
    numValue !== undefined && numValue !== null ? numValue : config.min;

  return (
    <div className={cn("space-y-2", config.className)}>
      <div className="flex items-center justify-between">
        <Label>
          {config.label}
          {config.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <span className="text-sm text-muted-foreground">
          {config.formatValue ? config.formatValue(displayValue) : displayValue}
        </span>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={displayValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}

/**
 * 自定义字段
 */
function CustomField({
  config,
  value,
  onChange,
  error,
  disabled,
  fullConfig,
}: {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
  fullConfig: LLMConfig;
}) {
  if (config.type !== "custom") return null;

  const renderProps: CustomFieldRenderProps = {
    value,
    onChange,
    error,
    disabled,
    config: fullConfig,
  };

  return (
    <div className={cn("space-y-2", config.className)}>
      {config.label && (
        <Label>
          {config.label}
          {config.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {config.render(renderProps)}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}
