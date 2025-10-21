# Personal YouWare Platform

This project rebuilds the Personal YouWare interface as a single-page React application backed by Vite. It delivers a minimalist workspace inspired by the YouWare aesthetic, supports multiple AI providers, tracks usage, and exposes the source code for inspection or export.

## Features

- 🔀 **Provider Switching** – toggle between OpenAI, Anthropic, Google Gemini, OpenRouter, and DeepSeek (bring your own API keys).
- 🧠 **Live Code Generation** – prompt any configured model and stream the response into the Monaco editor.
- ▶️ **Inline Execution Sandbox** – run snippets safely in a browser-based sandbox.
- 📊 **Usage Analytics** – view aggregate token counts and per-provider cost approximations.
- 🔐 **Encrypted Key Storage** – API keys are encrypted in `localStorage` before persistence.
- 🗂️ **Source Code Browser** – inspect, edit, copy, and export project files as a ZIP archive.
- 🌱 **Integrated Versioning** – lightweight version control simulator to commit snapshots and reset to previous baselines.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000/ to access the workspace.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    Sidebar.tsx
    CodeEditor.tsx
    MainLayout.tsx
    views/
      EditorView.tsx
      DashboardView.tsx
      SettingsView.tsx
      VersionControlView.tsx
      SourceCodeView.tsx
  services/
    aiService.ts
    apiKeyManager.ts
    codeExecutor.ts
    versionControl.ts
    usageTracker.ts
  utils/
    encryption.ts
    sourceCodeExporter.ts
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
```

## Notes

- Provider calls use browser `fetch`/`axios`; ensure CORS access for your API keys when testing locally.
- Version control operations are simulated entirely in the browser for security reasons.
- Usage metrics are stored in `localStorage` and can be cleared by purging site data.
