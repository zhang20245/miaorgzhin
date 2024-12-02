import { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { APISettings, DEFAULT_API_SETTINGS, ModelProvider, MODEL_OPTIONS, DEFAULT_API_KEYS } from '../types/api';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [settings, setSettings] = useState<APISettings>(() => {
    const saved = localStorage.getItem('apiSettings');
    return saved ? JSON.parse(saved) : DEFAULT_API_SETTINGS;
  });
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProviderChange = (provider: ModelProvider) => {
    setSettings(prev => ({
      ...prev,
      provider,
      model: MODEL_OPTIONS[provider][0].id, // Set first model as default
      apiKey: prev.isDefaultKey ? DEFAULT_API_KEYS[provider] : prev.apiKey,
      isDefaultKey: prev.isDefaultKey
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);

    if (!settings.apiKey.trim()) {
      setError('API 密钥不能为空');
      return;
    }

    if (settings.temperature < 0 || settings.temperature > 1) {
      setError('温度值必须在 0 到 1 之间');
      return;
    }

    if (settings.maxTokens < 1 || settings.maxTokens > 8192) {
      setError('最大令牌数必须在 1 到 8192 之间');
      return;
    }

    localStorage.setItem('apiSettings', JSON.stringify(settings));
    setSaveSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      ...DEFAULT_API_SETTINGS,
      apiKey: DEFAULT_API_KEYS[DEFAULT_API_SETTINGS.provider],
      isDefaultKey: true
    });
    setError('');
    setSaveSuccess(false);
  };

  const handleApiKeyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      apiKey: value,
      isDefaultKey: value === DEFAULT_API_KEYS[prev.provider]
    }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 
            transition-all duration-200 transform hover:scale-110 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 animate-slide-in">API 设置</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-50 text-green-500 p-3 rounded-lg text-sm animate-pop">
              设置已保存！
            </div>
          )}

          <div className="animate-slide-in">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI 提供商
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange('fireworks')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                  settings.provider === 'fireworks'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fireworks
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                  settings.provider === 'gemini'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Gemini
              </button>
            </div>
          </div>
          
          <div className="animate-slide-in">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 密钥
              {settings.isDefaultKey && (
                <span className="ml-2 text-xs text-green-600">
                  （使用默认密钥）
                </span>
              )}
            </label>
            <input
              type="text"
              value={settings.apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
                hover:border-blue-500 hover:shadow-md
                transform hover:scale-[1.01]"
              placeholder={`输入你的 ${settings.provider === 'gemini' ? 'Gemini' : 'Fireworks'} API 密钥`}
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
                hover:border-blue-500 hover:shadow-md
                transform hover:scale-[1.01]"
            >
              {MODEL_OPTIONS[settings.provider].map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              温度 (0-1)
            </label>
            <input
              type="number"
              value={settings.temperature}
              onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
                hover:border-blue-500 hover:shadow-md
                transform hover:scale-[1.01]"
              step="0.1"
              min="0"
              max="1"
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大令牌数
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
                hover:border-blue-500 hover:shadow-md
                transform hover:scale-[1.01]"
              min="1"
              max="8192"
            />
          </div>

          <div className="flex gap-2 pt-2 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg 
                transition-all duration-200
                hover:bg-gray-200 hover:shadow-md
                transform hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg 
                transition-all duration-200
                hover:bg-blue-600 hover:shadow-lg
                transform hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              保存设置
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}