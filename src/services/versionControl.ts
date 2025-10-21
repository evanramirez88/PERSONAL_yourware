import type { SourceFile, VersionStatusEntry } from '@/types';

const BASELINE_STORAGE_KEY = 'yourware::vcs::baseline';
const HISTORY_STORAGE_KEY = 'yourware::vcs::history';

interface CommitEntry {
  id: string;
  message: string;
  timestamp: string;
  files: VersionStatusEntry[];
}

function readBaseline(): Record<string, string> {
  try {
    const raw = localStorage.getItem(BASELINE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch (error) {
    console.error('Unable to parse baseline snapshot', error);
    return {};
  }
}

function writeBaseline(snapshot: Record<string, string>) {
  localStorage.setItem(BASELINE_STORAGE_KEY, JSON.stringify(snapshot));
}

function readHistory(): CommitEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CommitEntry[];
  } catch (error) {
    console.error('Unable to parse commit history', error);
    return [];
  }
}

function writeHistory(history: CommitEntry[]) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function computeStatus(files: SourceFile[]): VersionStatusEntry[] {
  const baseline = readBaseline();
  const status: VersionStatusEntry[] = [];
  const currentPaths = new Set(files.map((file) => file.path));

  files.forEach((file) => {
    if (!(file.path in baseline)) {
      status.push({ path: file.path, status: 'untracked' });
    } else if (baseline[file.path] !== file.content) {
      status.push({ path: file.path, status: 'modified' });
    }
  });

  Object.keys(baseline).forEach((path) => {
    if (!currentPaths.has(path)) {
      status.push({ path, status: 'deleted' });
    }
  });

  return status;
}

export function commit(files: SourceFile[], message: string): CommitEntry {
  const status = computeStatus(files);
  const entry: CommitEntry = {
    id: crypto.randomUUID(),
    message,
    timestamp: new Date().toISOString(),
    files: status
  };

  const history = readHistory();
  history.unshift(entry);
  writeHistory(history);

  const snapshot = files.reduce<Record<string, string>>((acc, file) => {
    acc[file.path] = file.content;
    return acc;
  }, {});
  writeBaseline(snapshot);

  return entry;
}

export function resetToBaseline(): Record<string, string> {
  return readBaseline();
}

export function listCommits(): CommitEntry[] {
  return readHistory();
}

export type { CommitEntry };
