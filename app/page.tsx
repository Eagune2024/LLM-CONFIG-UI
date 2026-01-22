"use client";

import * as React from "react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LLMConfigForm } from "@/registry/new-york/blocks/llm-config/components";
import type {
  LLMConfig,
  LLMConfigFormRef,
} from "@/registry/new-york/blocks/llm-config/components";
import { defaultLLMFormConfig } from "@/registry/new-york/blocks/llm-config/lib/default-form-config";
import { DEFAULT_CONFIG } from "@/registry/new-york/blocks/llm-config/lib/providers";
import { Button } from "@/registry/new-york/ui/button";

export default function Home() {
  const formRef = React.useRef<LLMConfigFormRef>(null);
  const [config, setConfig] = React.useState<LLMConfig>(DEFAULT_CONFIG);

  const handleConfigChange = (newConfig: LLMConfig) => {
    setConfig(newConfig);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleConfirm = () => {
    const result = formRef.current?.validate();
    if (result === true) {
      console.log("配置校验通过:", config);
      alert(`配置已确认:\n${JSON.stringify(config, null, 2)}`);
    } else {
      console.log("配置校验失败:", result);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">LLM CONFIG UI</h1>
        <p className="text-muted-foreground">
          A component for configuring LLM models.
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
              ref={formRef}
              config={defaultLLMFormConfig}
              value={config}
              onChange={handleConfigChange}
              progressive={true}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
