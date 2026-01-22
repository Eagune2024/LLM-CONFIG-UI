"use client";

import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Info } from "lucide-react";

export interface BaseUrlInputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function BaseUrlInput({
  label = "Base URL",
  placeholder = "自定义 Base URL（可选）",
  className,
  error,
}: BaseUrlInputProps) {
  const { config, updateConfig, getProviderConfig } = useLLMConfig();
  const providerConfig = getProviderConfig();
  const defaultBaseUrl = providerConfig?.baseURL;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        {label && <Label>{label}</Label>}
        {defaultBaseUrl && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>默认: {defaultBaseUrl}</span>
          </div>
        )}
      </div>
      <Input
        type="url"
        placeholder={placeholder}
        value={config.baseURL || ""}
        onChange={(e) => updateConfig({ baseURL: e.target.value })}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
