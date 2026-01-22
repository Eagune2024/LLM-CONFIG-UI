"use client";

import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

export interface ModelSelectorProps {
  title?: string;
  groupByProvider?: boolean;
  filter?: (model: any) => boolean;
  error?: string;
  className?: string;
}

export function ModelSelector({
  title = "选择模型",
  filter,
  error,
  className,
}: ModelSelectorProps) {
  const { config, updateConfig, getAvailableModels } = useLLMConfig();
  const models = getAvailableModels().filter(filter || (() => true));

  return (
    <div className="space-y-2">
      {title && <Label>{title}</Label>}
      <Select
        value={config.model as string | undefined}
        onValueChange={(value) => updateConfig({ model: value })}
      >
        <SelectTrigger
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full",
            className,
          )}
        >
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={String(model.id)}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
