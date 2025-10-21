import { useEffect, useMemo, useState } from 'react';
import CodeEditor from '../CodeEditor';
import { exportAsZip } from '@/utils/sourceCodeExporter';
import type { SourceFileDescriptor } from '@/types';

const modules = import.meta.glob('../../**/*', { as: 'raw', eager: false });

const SourceCodeView = () => {
  const [files, setFiles] = useState<SourceFileDescriptor[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const load = async () => {
      const entries: SourceFileDescriptor[] = [];
      for (const [path, loader] of Object.entries(modules)) {
        if (!path.includes('/src/') || path.endsWith('.png') || path.endsWith('.jpg')) continue;
        const raw = await (loader as () => Promise<string>)();
        const normalized = path.replace('../../', '');
        entries.push({ path: normalized, content: raw });
      }
      entries.sort((a, b) => a.path.localeCompare(b.path));
      setFiles(entries);
      if (entries[0]) {
        setSelectedFile(entries[0].path);
        setContent(entries[0].content);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const next = files.find((file) => file.path === selectedFile);
    if (next) {
      setContent(next.content);
    }
  }, [files, selectedFile]);

  const handleExport = () => {
    exportAsZip(files);
  };

  const filteredFiles = useMemo(() => files.filter((file) => file.path.endsWith('.ts') || file.path.endsWith('.tsx')), [files]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-medium">Source Explorer</h1>
          <p className="text-sm text-black/60">Inspect, copy, and export the entire application source code.</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-youware-primary text-white px-4 py-2 text-sm font-medium shadow-subtle"
        >
          Export ZIP
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="rounded-2xl border border-black/10 bg-white shadow-subtle p-4 max-h-[600px] overflow-y-auto">
          <ul className="space-y-1 text-sm">
            {filteredFiles.map((file) => (
              <li key={file.path}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedFile === file.path ? 'bg-youware-primary/10 text-youware-primary' : 'hover:bg-black/5 text-black/70'
                  }`}
                  onClick={() => setSelectedFile(file.path)}
                >
                  {file.path.replace('src/', '')}
                </button>
              </li>
            ))}
            {filteredFiles.length === 0 && <li className="text-black/50">No source files detected.</li>}
          </ul>
        </aside>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{selectedFile || 'Select a file'}</h2>
            <button
              className="text-sm text-youware-primary"
              onClick={() => navigator.clipboard.writeText(content)}
              disabled={!content}
            >
              Copy to clipboard
            </button>
          </div>
          <CodeEditor value={content} language="typescript" readOnly onChange={() => {}} />
        </section>
      </div>
    </div>
  );
};

export default SourceCodeView;
