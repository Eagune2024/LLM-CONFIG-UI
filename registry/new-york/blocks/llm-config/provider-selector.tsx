"use client";

import { useLLMConfig } from "./provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/registry/new-york/ui/label";
import type { LLMProvider } from "./types";

export interface ProviderSelectorProps {
  title?: string;
  className?: string;
}

export function ProviderSelector({
  title = "API 提供商",
  className,
}: ProviderSelectorProps) {
  const { config, updateConfig, getProviderConfig } = useLLMConfig();
  const providers = getProviderConfig()
    ? [getProviderConfig()]
    : [
        { id: "openai", displayName: "OpenAI" },
        { id: "anthropic", displayName: "Anthropic" },
        { id: "azure-openai", displayName: "Azure OpenAI" },
        { id: "google", displayName: "Google" },
        { id: "cohere", displayName: "Cohere" },
        { id: "ollama", displayName: "Ollama" },
      ];

  return (
    <div className={cn("space-y-2", className)}>
      {title && <Label>{title}</Label>}
      <Select
        value={config.provider}
        onValueChange={(value) =>
          updateConfig({ provider: value as LLMProvider })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择提供商" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
