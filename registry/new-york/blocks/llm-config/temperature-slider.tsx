"use client";

import { useLLMConfig } from "./provider";
import { cn } from "@/lib/utils";
import { Label } from "@/registry/new-york/ui/label";

export interface TemperatureSliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function TemperatureSlider({
  label = "Temperature",
  min = 0,
  max = 2,
  step = 0.1,
  className,
}: TemperatureSliderProps) {
  const { config, updateConfig } = useLLMConfig();
  const temperature = config.temperature ?? 0.7;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label && <Label>{label}</Label>}
        <span className="text-sm text-muted-foreground">{temperature}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={temperature}
        onChange={(e) =>
          updateConfig({ temperature: parseFloat(e.target.value) })
        }
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}
