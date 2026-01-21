"use client";

import React, { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useLLMConfig } from "./provider";

export interface TestResult {
  success: boolean;
  data?: {
    provider: string;
    model: string;
    latency: number;
    usage?: any;
  };
  error?: string;
}

export interface ConnectionTestButtonProps {
  onSuccess?: (result: TestResult) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ConnectionTestButton({
  onSuccess,
  onError,
  className,
  children = "测试连接",
}: ConnectionTestButtonProps) {
  const { config } = useLLMConfig();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleTest = async () => {
    if (!config.provider || !config.apiKey) {
      onError?.("请先选择提供商并输入API Key");
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        onSuccess?.(data);
      } else {
        onError?.(data.error || "连接测试失败");
      }
    } catch (error: any) {
      const errorResult: TestResult = {
        success: false,
        error: error.message || "网络请求失败",
      };
      setResult(errorResult);
      onError?.(error.message || "网络请求失败");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={handleTest}
        disabled={testing || !config.provider || !config.apiKey}
        className="w-full"
      >
        {testing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            测试中...
          </>
        ) : (
          children
        )}
      </Button>

      {result && (
        <div
          className={`mt-2 flex items-center gap-2 text-sm ${
            result.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.success ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>连接成功！延迟: {result.data?.latency}ms</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span>{result.error}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
