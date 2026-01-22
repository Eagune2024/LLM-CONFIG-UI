"use client";

import React, { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import type { LLMConfigFormProps, FieldConfig, LLMConfigFormRef } from "./form-config";
import type { LLMConfig, ValidationResult } from "./types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/new-york/ui/collapsible";

/**
 * 配置驱动的LLM配置表单组件
 * 通过声明式配置定义表单结构，支持动态字段显示、条件验证等高级功能
 */
export const LLMConfigForm = forwardRef<LLMConfigFormRef, LLMConfigFormProps>(
  (
    {
      config: formConfig,
      value,
      onChange,
      validate,
      className,
    },
    ref,
  ) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 执行字段验证
    const validateField = (
      fieldConfig: FieldConfig,
      fieldValue: unknown,
      currentConfig: LLMConfig,
    ): string | null => {
      // 检查必填字段
      const isRequired =
        typeof fieldConfig.required === "function"
          ? fieldConfig.required(currentConfig)
          : fieldConfig.required;

      if (
        isRequired &&
        (fieldValue === undefined || fieldValue === null || fieldValue === "")
      ) {
        return `${fieldConfig.label}是必填项`;
      }

      // 执行自定义验证
      if (fieldConfig.validate) {
        const customError = fieldConfig.validate(fieldValue, currentConfig);
        if (customError) {
          return customError;
        }
      }

      return null;
    };

    // 配置级别验证
    const validateConfig = (): ValidationResult => {
      if (validate) {
        return validate(value);
      }

      const validationErrors: Record<string, string> = {};

      if (!value.provider) {
        validationErrors.provider = "请选择提供商";
      }

      if (!value.apiKey) {
        validationErrors.apiKey = "请输入 API Key";
      }

      if (!value.model) {
        validationErrors.model = "请选择模型";
      }

      // 提供商特定验证
      if (value.provider === "azure-openai") {
        if (!value.azureDeploymentName) {
          validationErrors.azureDeploymentName = "请输入部署名称";
        }
        if (!value.azureApiVersion) {
          validationErrors.azureApiVersion = "请选择 API 版本";
        }
      }

      return Object.keys(validationErrors).length === 0
        ? true
        : { valid: false, errors: validationErrors };
    };

    // 暴露给父组件的方法
    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          const result = validateConfig();
          if (result !== true) {
            setErrors(result.errors || {});
          } else {
            setErrors({});
          }
          return result;
        },
      }),
      [value, validate],
    );

    // 处理字段更新
    const handleFieldChange = (
      fieldName: keyof LLMConfig,
      fieldValue: unknown,
    ) => {
      const newConfig = { ...value, [fieldName]: fieldValue };
      onChange?.(newConfig);
    };

    // 过滤需要显示的字段组
    const visibleGroups = useMemo(() => {
      return formConfig.groups
        .map((group) => {
          // 检查组内是否有可见字段
          const visibleFields = group.fields.filter((field) => {
            const isVisible =
              typeof field.visible === "function"
                ? field.visible(value)
                : (field.visible ?? true);

            return isVisible;
          });

          return {
            ...group,
            fields: visibleFields,
          };
        })
        .filter((group) => group.fields.length > 0);
    }, [formConfig.groups, value]);

    return (
      <div className={cn("space-y-6 w-full", className)}>
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
                    value={value[field.name]}
                    onChange={(newValue) =>
                      handleFieldChange(field.name, newValue)
                    }
                    fullConfig={value}
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
                        value={value[field.name]}
                        onChange={(newValue) =>
                          handleFieldChange(field.name, newValue)
                        }
                        fullConfig={value}
                      />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return groupContent;
          })}
        </div>
      </div>
    );
  },
);

LLMConfigForm.displayName = "LLMConfigForm";
