import { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import './MainLayout.css';

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">
        <header className="layout__header">
          <h1 className="layout__title">Personal YouWare</h1>
          <p className="layout__subtitle">Multi-agent coding canvas with live generation, versioning, and analytics.</p>
        </header>
        <section className="layout__body">{children}</section>
      </main>
    </div>
  );
}

export default MainLayout;
