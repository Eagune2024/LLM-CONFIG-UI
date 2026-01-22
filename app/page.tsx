"use client";

import * as React from "react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LLMConfigForm } from "@/registry/new-york/blocks/llm-config/components";
import type { LLMConfig } from "@/registry/new-york/blocks/llm-config/components";
import { defaultLLMFormConfig } from "@/registry/new-york/blocks/llm-config/lib/default-form-config";
import { DEFAULT_CONFIG } from "@/registry/new-york/blocks/llm-config/lib/providers";

export default function Home() {
  const [config, setConfig] = React.useState<LLMConfig>(DEFAULT_CONFIG);

  const handleConfigChange = (newConfig: LLMConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              LLM Configuration Form
            </h2>
            <OpenInV0Button name="llm-config" className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <LLMConfigForm
              config={defaultLLMFormConfig}
              value={config}
              onChange={handleConfigChange}
              showSubmitButton={false}
              showResetButton={false}
              progressive={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
