# LLM-CONFIG-UI
The LLM-CONFIG-UI is an AI configuration component based on shadcn/ui, designed for efficient, simple, and quick AI integration, avoiding the need to reinvent the wheel.

# Configuration

Add registries to your components.json:

components.json
``` json
{
  "registries": {
    "@LLM-CONFIG-UI": "https://eagune2024.github.io/LLM-CONFIG-UI/r/{name}.json"
  }
}
```

Then start installing:

`pnpm dlx shadcn@latest add @LLM-CONFIG-UI/llm-config`
