import { useState } from 'react';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Login } from './Login';
import { Register } from './Register';

export function AuthButtons() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">你好，{user.name}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowLogin(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          登录
        </button>
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          注册
        </button>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </>
  );
}