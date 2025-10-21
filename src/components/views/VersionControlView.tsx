import { FormEvent, useEffect, useState } from 'react';
import { commitChanges, getGitStatus, type VersionControlSummary } from '@/services/versionControl';

const VersionControlView = () => {
  const [summary, setSummary] = useState<VersionControlSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    getGitStatus().then(setSummary);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commitMessage) {
      setMessage('Enter a commit message first.');
      return;
    }
    const result = await commitChanges(commitMessage);
    if (result.success) {
      setMessage(`Mock commit created: ${result.hash}`);
      setCommitMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">Version Control</h1>
        <p className="text-sm text-black/60">Review repository status and stage commits.</p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
        <h2 className="text-lg font-semibold mb-4">Repository Status</h2>
        {summary ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Current Branch</p>
              <p className="text-sm text-black/60">{summary.currentBranch}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Commit</p>
              <p className="text-sm text-black/60">{summary.lastCommit?.message}</p>
              <p className="text-xs text-black/40">
                {summary.lastCommit?.hash} • {summary.lastCommit?.author} •{' '}
                {summary.lastCommit ? new Date(summary.lastCommit.date).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Changed Files</p>
              <ul className="space-y-1">
                {summary.status.map((entry) => (
                  <li key={entry.path} className="text-sm text-black/70">
                    <span className="uppercase text-xs font-semibold text-youware-primary mr-2">{entry.status}</span>
                    {entry.path}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-black/50">Loading repository information…</p>
        )}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
        <h2 className="text-lg font-semibold mb-4">Create Commit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={commitMessage}
            onChange={(event) => setCommitMessage(event.target.value)}
            placeholder="Describe your changes"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-youware-primary text-white px-4 py-2 text-sm font-medium shadow-subtle"
          >
            Commit Changes
          </button>
        </form>
        {message && <p className="text-sm text-black/60 mt-4">{message}</p>}
      </section>
    </div>
  );
};

export default VersionControlView;
