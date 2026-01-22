"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import type { LLMConfigFormProps, FieldConfig } from "./form-config";
import type { LLMConfig } from "./types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york/ui/collapsible";

/**
 * 配置驱动的LLM配置表单组件
 * 通过声明式配置定义表单结构，支持动态字段显示、条件验证等高级功能
 */
export function LLMConfigForm({
  config: formConfig,
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

  // 执行字段验证
  const validateField = (
    fieldConfig: FieldConfig,
    value: unknown,
    currentConfig: LLMConfig,
  ): string | null => {
    // 检查必填字段
    const isRequired =
      typeof fieldConfig.required === "function"
        ? fieldConfig.required(currentConfig)
        : fieldConfig.required;

    if (isRequired && (value === undefined || value === null || value === "")) {
      return `${fieldConfig.label}是必填项`;
    }

    // 执行自定义验证
    if (fieldConfig.validate) {
      const customError = fieldConfig.validate(value, currentConfig);
      if (customError) {
        return customError;
      }
    }

    return null;
  };

  // 验证所有字段
  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    formConfig.groups.forEach((group) => {
      group.fields.forEach((field) => {
        // 检查字段是否可见
        const isVisible =
          typeof field.visible === "function"
            ? field.visible(config)
            : (field.visible ?? true);

        if (isVisible) {
          const value = config[field.name];
          const error = validateField(field, value, config);
          if (error) {
            newErrors[field.name as string] = error;
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateOnSubmit) {
      const isValid = validateAllFields();
      if (!isValid) {
        return;
      }
    }

    // 执行Context级别的验证（如果有）
    const contextValidation = validateConfig();
    if (contextValidation !== true) {
      const contextErrors =
        (contextValidation as { errors?: Record<string, string> }).errors || {};
      setErrors(contextErrors);
      return;
    }

    await onSubmit?.(config);
  };

  const handleReset = () => {
    resetConfig();
    setErrors({});
    onReset?.();
  };

  // 渐进式表单：根据provider选择决定是否显示后续字段
  const shouldShowCredentials = !progressive || !!config.provider;

  // 过滤需要显示的字段组
  const visibleGroups = useMemo(() => {
    return formConfig.groups
      .map((group) => {
        // 检查组内是否有可见字段
        const visibleFields = group.fields.filter((field) => {
          const isVisible =
            typeof field.visible === "function"
              ? field.visible(config)
              : (field.visible ?? true);

          // 渐进式表单逻辑
          if (
            progressive &&
            !shouldShowCredentials &&
            field.name !== "provider"
          ) {
            return false;
          }

          return isVisible;
        });

        return {
          ...group,
          fields: visibleFields,
        };
      })
      .filter((group) => group.fields.length > 0);
  }, [formConfig.groups, config, progressive, shouldShowCredentials]);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6 w-full", className)}>
      <div className="space-y-4">
        {visibleGroups.map((group, groupIndex) => {
          const groupContent = (
            <div
              key={groupIndex}
              className={cn(
                "space-y-4",
                group.className,
                !group.collapsible && "border rounded-lg p-4",
              )}
            >
              {group.title && !group.collapsible && (
                <h3 className="text-lg font-semibold">{group.title}</h3>
              )}
              {group.fields.map((field, fieldIndex) => (
                <FormField
                  key={`${groupIndex}-${fieldIndex}`}
                  config={field}
                  error={errors[field.name as string]}
                />
              ))}
            </div>
          );

          if (group.collapsible) {
            return (
              <Collapsible key={groupIndex} className="border rounded-lg">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 h-auto hover:bg-muted/50">
                  <span className="font-medium">{group.title || ""}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-2 space-y-4">
                  {group.fields.map((field, fieldIndex) => (
                    <FormField
                      key={`${groupIndex}-${fieldIndex}`}
                      config={field}
                      error={errors[field.name as string]}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return groupContent;
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
