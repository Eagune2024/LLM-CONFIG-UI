"use client";

import React, { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";

export interface LLMConfigFormProps {
  children: React.ReactNode;
  onSubmit?: (config: any) => void | Promise<void>;
  onReset?: () => void;
  validateOnSubmit?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  showSubmitButton?: boolean;
  showResetButton?: boolean;
  className?: string;
  progressive?: boolean; // 是否启用渐进式表单
}

export function LLMConfigForm({
  children,
  onSubmit,
  onReset,
  validateOnSubmit = true,
  submitButtonText = "保存",
  resetButtonText = "重置",
  showSubmitButton = true,
  showResetButton = true,
  className,
  progressive = false,
}: LLMConfigFormProps) {
  const { config, resetConfig, validateConfig } = useLLMConfig();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateOnSubmit) {
      const result = validateConfig();
      if (result !== true) {
        setErrors((result as { errors?: Record<string, string> }).errors || {});
        return;
      }
    }

    setErrors({});
    await onSubmit?.(config);
  };

  const handleReset = () => {
    resetConfig();
    setErrors({});
    onReset?.();
  };

  // 渐进式表单逻辑：根据provider选择决定是否显示后续字段
  const shouldShowCredentials = !progressive || !!config.provider;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-4">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return child;
          }

          const childType =
            (child.type as any).displayName || (child.type as any).name;
          const childProps = child.props as any;

          // 渐进式表单：ProviderSelector始终显示
          if (progressive && childType === "ProviderSelector") {
            return React.cloneElement(child as React.ReactElement<any>, {
              error: errors[childProps.name] || errors[childProps.fieldName],
            });
          }

          // 渐进式表单：其他组件只在provider选中后显示
          if (progressive && !shouldShowCredentials) {
            return null;
          }

          return React.cloneElement(child as React.ReactElement<any>, {
            error: errors[childProps.name] || errors[childProps.fieldName],
          });
        })}
      </div>

      {(showSubmitButton || showResetButton) && (
        <div className="flex justify-end gap-2">
          {showResetButton && (
            <Button type="button" variant="outline" onClick={handleReset}>
              {resetButtonText}
            </Button>
          )}
          {showSubmitButton && (
            <Button type="submit">{submitButtonText}</Button>
          )}
        </div>
      )}
    </form>
  );
}
