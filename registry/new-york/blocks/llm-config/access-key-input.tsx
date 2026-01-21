"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";

export interface AccessKeyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  showToggle?: boolean;
  validate?: (value: string) => boolean | string;
  error?: string;
}

export function AccessKeyInput({
  label = "API Key",
  placeholder = "输入你的 API Key",
  showToggle = true,
  validate,
  error,
  className,
  ...props
}: AccessKeyInputProps) {
  const { config, updateConfig } = useLLMConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateConfig({ apiKey: value });

    if (validate) {
      const result = validate(value);
      setInternalError(typeof result === "string" ? result : null);
    }
  };

  const displayError = error || internalError;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            displayError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          placeholder={placeholder}
          value={config.apiKey}
          onChange={handleChange}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  );
}
