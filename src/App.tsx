import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import { Chat } from './components/Chat';
import { Vercel } from './components/Vercel';
import { Cat } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { AuthButtons } from './components/AuthButtons';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <header className="border-b p-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Cat className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">喵哥 AI</h1>
            </Link>
            <AuthButtons />
          </header>

          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/vercel" element={<Vercel />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;