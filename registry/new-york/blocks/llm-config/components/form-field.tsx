"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select";
import { ProviderFormField } from "../lib/provider-form-config";

interface FormFieldProps {
  config: ProviderFormField;
  error?: string;
  value: unknown;
  onChange: (value: unknown) => void;
}

/**
 * 通用表单字段组件
 * 根据字段配置类型自动渲染对应的输入组件
 */
export function FormField({ config, error, value, onChange }: FormFieldProps) {
  // 根据字段类型渲染不同的组件
  switch (config.type) {
    case "select":
      return (<SelectField config={config} value={value} onChange={onChange} error={error} /> );
    case "input":
    case "password":
      return (<TextField config={config} value={value} onChange={onChange} error={error} /> );
    default:
      return null;
  }
}

/**
 * 字段包装器组件 - 共性的 Label、error、description
 */
function FieldWrapper({ label, required, error, description, className, children }: { label: string; required?: boolean; error?: string; description?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/**
 * 选择框字段
 */
function SelectField({ config, value, onChange, error }: FormFieldProps) {
  if (config.type !== "select") return null;
  return (
    <FieldWrapper label={config.label} required={config.required} error={error} description={config.description} className={config.className}>
      <Select value={String(value ?? "")} onValueChange={onChange} >
        <SelectTrigger className={cn(error && "border-destructive focus-visible:ring-destructive", "w-full")}>
          <SelectValue placeholder={config.placeholder || `选择${config.label}`} />
        </SelectTrigger>
        <SelectContent>
          {config.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

/**
 * 文本/密码字段
 */
function TextField({ config, value, onChange, error }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  if (config.type !== "input" && config.type !== "password") return null;
  return (
    <FieldWrapper label={config.label} required={config.required} error={error} description={config.description} className={config.className}>
      <div className="relative">
        <Input
          type={ config.type === "password" && !showPassword ? "password" : "text" }
          className={cn( error && "border-destructive focus-visible:ring-destructive")}
          placeholder={config.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
        {config.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? ( <EyeOff className="h-4 w-4" /> ) : ( <Eye className="h-4 w-4" /> )}
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}

