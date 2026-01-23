export interface ProviderFormField {
  prop: string;
  label: string;
  type: "select" | "input";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
}

export interface ProviderFormConfig {
  [key: string]: ProviderFormField[];
}

export const PROVIDER_FORM_CONFIGS: ProviderFormConfig = {
  "Z.ai": [
    {
      prop: "zai-service-site",
      label: "Z AI 服务站点",
      type: "select",
      options: [
        { label: "International Coding(https://api.z.ai/api/coding/pass/v4)", value: "1" },
        { label: "China Coding(https://open.bigmodel.cn/api/coding/pass/v4)", value: "2" },
        { label: "International API(https://api.z.ai/api/pass/v4)", value: "3" },
        { label: "China API(https://open.bigmodel.cn/api/pass/v4)", value: "4" }
      ],
    },
    {
      prop: "zai-api-key",
      label: "Z AI API 密钥",
      type: "input",
    }
  ]
};
