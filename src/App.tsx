import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import EditorView from './components/views/EditorView';
import DashboardView from './components/views/DashboardView';
import SettingsView from './components/views/SettingsView';
import VersionControlView from './components/views/VersionControlView';
import SourceCodeView from './components/views/SourceCodeView';
import NotFoundView from './components/views/NotFoundView';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/editor" replace />} />
        <Route path="editor" element={<EditorView />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="version-control" element={<VersionControlView />} />
        <Route path="source" element={<SourceCodeView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default App;
