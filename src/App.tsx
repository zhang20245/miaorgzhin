import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import { Chat } from './components/Chat';
import { Vercel } from './components/Vercel';
import { Deploy } from './components/Deploy';
import { Cat, Settings as SettingsIcon } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { AuthButtons } from './components/AuthButtons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Settings } from './components/Settings';
import { useState } from 'react';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white">
            <header className="border-b p-4 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Cat className="w-8 h-8 text-blue-500" />
                <h1 className="text-xl font-bold">喵哥 AI</h1>
              </Link>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="API 设置"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
                <AuthButtons />
              </div>
            </header>

            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/vercel" element={<Vercel />} />
              <Route path="/github" element={<Deploy />} />
            </Routes>

            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;