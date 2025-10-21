import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import EditorView from './components/views/EditorView';
import DashboardView from './components/views/DashboardView';
import SettingsView from './components/views/SettingsView';
import VersionControlView from './components/views/VersionControlView';
import SourceCodeView from './components/views/SourceCodeView';

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        <Route path="/editor" element={<EditorView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/version-control" element={<VersionControlView />} />
        <Route path="/source" element={<SourceCodeView />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
