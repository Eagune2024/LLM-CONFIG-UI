
export const PROVIDER_FORM_CONFIGS = {
  "Z.ai": [
    {
      prop: "zai-service-site",
      label: "Z AI 服务站点",
      type: "select",
      options: [
        { label: "International Coding(https://api.z.ai/api/coding/pass/v4)", value: "" },
        { label: "China Coding(https://open.bigmodel.cn/api/coding/pass/v4)", value: "" },
        { label: "International API(https://api.z.ai/api/pass/v4)", value: "" },
        { label: "China API(https://open.bigmodel.cn/api/pass/v4)", value: "" }
      ],
    },
    {
      prop: "zai-api-key",
      label: "Z AI API 密钥",
      type: "input",
    }
  ]
};
