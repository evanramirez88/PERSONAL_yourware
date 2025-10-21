import { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-youware-bg text-slate-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
