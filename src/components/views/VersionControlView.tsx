import { useEffect, useState } from 'react';
import type { SourceFile, VersionStatusEntry } from '@/types';
import { commit, computeStatus, listCommits, resetToBaseline, type CommitEntry } from '@/services/versionControl';
import './VersionControlView.css';

interface VersionControlViewProps {
  files: SourceFile[];
  onResetFiles: (snapshot: Record<string, string>) => void;
}

export function VersionControlView({ files, onResetFiles }: VersionControlViewProps) {
  const [status, setStatus] = useState<VersionStatusEntry[]>([]);
  const [commits, setCommits] = useState<CommitEntry[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setStatus(computeStatus(files));
    setCommits(listCommits());
  }, [files]);

  const handleCommit = () => {
    if (!message.trim()) return;
    const entry = commit(files, message.trim());
    setStatus([]);
    setCommits((prev) => [entry, ...prev]);
    setMessage('');
  };

  const handleReset = () => {
    const snapshot = resetToBaseline();
    onResetFiles(snapshot);
  };

  return (
    <div className="vcs">
      <div className="vcs__panel">
        <h2>Working Tree</h2>
        <div className="vcs__actions">
          <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Commit message" />
          <button onClick={handleCommit} disabled={!message.trim() || status.length === 0}>
            Commit
          </button>
          <button className="vcs__reset" onClick={handleReset}>
            Reset to Baseline
          </button>
        </div>
        {status.length === 0 ? (
          <p className="vcs__empty">No pending changes.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {status.map((entry) => (
                <tr key={entry.path}>
                  <td>{entry.path}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="vcs__panel">
        <h2>Commit History</h2>
        {commits.length === 0 ? (
          <p className="vcs__empty">No commits recorded.</p>
        ) : (
          <ul className="vcs__commits">
            {commits.map((entry) => (
              <li key={entry.id}>
                <header>
                  <strong>{entry.message}</strong>
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </header>
                <p>{entry.files.length} files</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default VersionControlView;
