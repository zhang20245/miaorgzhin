import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { Vercel } from './components/Vercel';
import { Deploy } from './components/Deploy';
import { Build } from './components/Build';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Chat />} />
                <Route path="/vercel" element={<Vercel />} />
                <Route path="/github" element={<Deploy />} />
                <Route path="/build" element={<Build />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;