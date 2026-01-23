"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { Label } from "@/registry/new-york/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select";
import { PROVIDER_FORM_CONFIGS } from "@/registry/new-york/blocks/llm-config/lib/provider-form-config";
import type { LLMConfig } from "./types";

interface LLMConfigFormProps {
  className?: string;
  value?: LLMConfig;
}

export const LLMConfigForm = ({ className, value }: LLMConfigFormProps) => {
  const providerOptions = Object.keys(PROVIDER_FORM_CONFIGS);
  const [selectedProvider, setSelectedProvider] = useState<string>(value?.provider || providerOptions[0]);
  const [customFields, setCustomFields] = useState<Record<string, any>>(value?.customFields || {});
  const currentProviderConfig = PROVIDER_FORM_CONFIGS[selectedProvider];

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setCustomFields({});
  };

  // 处理字段值变化
  const handleFieldChange = (fieldName: string, fieldValue: unknown) => {
    const newCustomFields = {
      ...customFields,
      [fieldName]: fieldValue,
    };
    setCustomFields(newCustomFields);
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>API提供商</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择API提供商" />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 根据选择的提供商动态渲染表单字段 */}
        {currentProviderConfig.map((fieldConfig) => (
          <FormField
            key={fieldConfig.prop}
            config={fieldConfig}
            value={customFields[fieldConfig.prop]}
            onChange={(value) => handleFieldChange(fieldConfig.prop, value)}
          />
        ))}
      </div>
    </div>
  );
};

LLMConfigForm.displayName = "LLMConfigForm";
