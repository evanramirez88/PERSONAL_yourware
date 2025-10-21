import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import EditorView from '@/components/views/EditorView';
import DashboardView from '@/components/views/DashboardView';
import SettingsView from '@/components/views/SettingsView';
import VersionControlView from '@/components/views/VersionControlView';
import SourceCodeView from '@/components/views/SourceCodeView';
import type { SourceFile } from '@/types';

const DEFAULT_FILES: SourceFile[] = [
  {
    path: 'src/main.tsx',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`
  },
  {
    path: 'src/services/aiService.ts',
    content: `// Service wiring for calling multiple model providers. This file is editable within the source viewer.
export interface Example {
  provider: string;
}
`
  },
  {
    path: 'README.md',
    content: '# Personal YouWare\n\nEdit files within this viewer and export them as a ZIP archive.'
  }
];

export function App() {
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>(DEFAULT_FILES);

  const handleUpdateFile = (path: string, content: string) => {
    setSourceFiles((files) => {
      const exists = files.some((file) => file.path === path);
      if (!exists) {
        return [...files, { path, content }];
      }
      return files.map((file) => (file.path === path ? { ...file, content } : file));
    });
  };

  const handleResetFiles = (snapshot: Record<string, string>) => {
    const entries = Object.entries(snapshot).map(([path, content]) => ({ path, content }));
    setSourceFiles(entries.length > 0 ? entries : DEFAULT_FILES);
  };

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<EditorView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/version-control" element={<VersionControlView files={sourceFiles} onResetFiles={handleResetFiles} />} />
        <Route path="/source" element={<SourceCodeView files={sourceFiles} onUpdateFile={handleUpdateFile} />} />
        <Route path="*" element={<p>Not found.</p>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
