"use client";

import React, { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select";
import { PROVIDER_FORM_CONFIGS } from "@/registry/new-york/blocks/llm-config/lib/provider-form-config";

interface LLMConfigFormProps {
  className?: string;
}

export const LLMConfigForm = ({ className }: LLMConfigFormProps) => {

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>API提供商</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(PROVIDER_FORM_CONFIGS).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 根据选择的提供商动态渲染表单字段 */}
      </div>
    </div>
  );
};

LLMConfigForm.displayName = "LLMConfigForm";
