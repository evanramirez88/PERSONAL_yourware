import type { GitStatusEntry } from '@/types';

export interface VersionControlSummary {
  currentBranch: string;
  status: GitStatusEntry[];
  lastCommit?: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
}

export const getGitStatus = async (): Promise<VersionControlSummary> => {
  // In a browser environment we cannot read git state directly.
  // This mocked implementation returns placeholder data so the UI can render.
  return {
    currentBranch: 'main',
    status: [
      { path: 'src/App.tsx', status: 'modified' },
      { path: 'src/components/Sidebar.tsx', status: 'added' }
    ],
    lastCommit: {
      hash: 'a1b2c3d',
      message: 'Initial commit',
      author: 'You',
      date: new Date().toISOString()
    }
  };
};

export const commitChanges = async (_message: string) => {
  return {
    success: true,
    hash: 'mocked'
  };
};
