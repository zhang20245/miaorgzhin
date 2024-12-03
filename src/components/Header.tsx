import { Link } from 'react-router-dom';
import { Cat, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { Settings } from './Settings';
import { AuthButtons } from './AuthButtons';

export function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
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
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}