import { useState, useEffect, useRef } from 'react';
import { Message, APISettings, DEFAULT_API_SETTINGS } from '../types/api';
import { UploadedFile } from '../types/files';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from './FileUpload';
import { Cat, Upload, Trash2, RefreshCw, WifiOff, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendMessageToGemini } from '../services/geminiApi';
import { ChatVersion, VersionHistory } from '../types/history';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState<VersionHistory>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : { versions: [], currentIndex: -1 };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();

    // Save new version when messages change
    if (messages.length > 0) {
      const newVersion: ChatVersion = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        messages: [...messages]
      };

      setHistory(prev => {
        const newVersions = [
          ...prev.versions.slice(0, prev.currentIndex + 1),
          newVersion
        ];
        return {
          versions: newVersions,
          currentIndex: newVersions.length - 1
        };
      });
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleError = (error: unknown): string => {
    if (!isOnline) return '网络连接已断开，请检查您的网络连接后重试。';
    if (error && typeof error === 'object' && 'response' in error) {
      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse.response?.status === 401) return 'API 密钥无效或已过期，请检查您的 API 密钥。';
      if (errorResponse.response?.status === 429) return 'API 调用频率超限，请稍后再试。';
    }
    if (error instanceof Error) return `服务器错误：${error.message}`;
    return '抱歉，服务出现了问题。请稍后重试。';
  };

  const handleRestore = (): void => {
    if (history.currentIndex > 0) {
      const previousVersion = history.versions[history.currentIndex - 1];
      setMessages([...previousVersion.messages]);
      setHistory(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const base64Content = e.target?.result as string;
          
          const uploadedFile: UploadedFile = {
            id: crypto.randomUUID(),
            name: file.name,
            content: base64Content,
            type: file.type,
            size: file.size,
            uploadedAt: Date.now()
          };

          const files: UploadedFile[] = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          files.push(uploadedFile);
          localStorage.setItem('uploadedFiles', JSON.stringify(files));

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `文件 "${file.name}" 上传成功！你现在可以询问我关于这个文档的问题。`
          }]);

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  const handleClearChat = (): void => {
    setMessages([]);
    setHistory({ versions: [], currentIndex: -1 });
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatHistory');
    setShowClearConfirm(false);
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
    }, 2000);
  };

  const handleRetry = async (): Promise<void> => {
    if (!messages.length) return;
    
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    setMessages(prev => prev.filter(m => m !== prev[prev.length - 1]));
    setError(null);
    
    await sendMessage(lastUserMessage.content);
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (isLoading) return;

    if (!isOnline) {
      setError('网络连接已断开，请检查您的网络连接后重试。');
      return;
    }

    const newMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const settings: APISettings = JSON.parse(localStorage.getItem('apiSettings') || JSON.stringify(DEFAULT_API_SETTINGS));
      const conversationHistory = [...messages, newMessage].slice(-10);

      let response: string;

      if (settings.provider === 'gemini') {
        response = await sendMessageToGemini(conversationHistory, settings);
      } else {
        const apiResponse = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
          },
          body: JSON.stringify({
            model: settings.model,
            max_tokens: settings.maxTokens,
            top_p: 1,
            top_k: 40,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: settings.temperature,
            messages: conversationHistory,
            stream: false
          })
        });

        if (!apiResponse.ok) {
          const error = await apiResponse.json();
          throw new Error(error.message || 'API_ERROR');
        }

        const data = await apiResponse.json();
        response = data.choices[0].message.content;
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = handleError(error);
      setError(errorMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const canRestore = history.currentIndex > 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {!isOnline && (
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3 animate-pop">
              <WifiOff className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700">网络连接已断开，请检查您的网络连接。</span>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <Cat className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce-in" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2 animate-slide-in">
                你好！我是喵哥
              </h2>
              <p className="text-gray-500 mb-4 animate-slide-in">
                让我们开始对话吧！我能记住上下文，可以进行连续对话。
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/github"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200 transform hover:scale-105"
                >
                  GitHub 部署教程
                </Link>
                <Link
                  to="/vercel"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200 transform hover:scale-105"
                >
                  Vercel 部署教程
                </Link>
                <Link
                  to="/build"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200 transform hover:scale-105"
                >
                  打包编译教程
                </Link>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex gap-2 items-center text-gray-500 animate-fade-in">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-thinking" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-thinking" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-thinking" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div>喵哥正在思考...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg animate-shake">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 
                  text-red-600 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
            </div>
          )}

          {clearSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pop">
              会话已清除
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpload(true)}
              className="p-2 text-gray-600 hover:text-blue-500 
                transition-all duration-200 
                hover:bg-blue-50 rounded-lg
                transform hover:scale-110"
              title="上传文档"
            >
              <Upload className="w-5 h-5" />
            </button>

            {canRestore && (
              <button
                onClick={handleRestore}
                className="p-2 text-gray-600 hover:text-blue-500 
                  transition-all duration-200 
                  hover:bg-blue-50 rounded-lg
                  transform hover:scale-110"
                title="恢复到上一个版本"
              >
                <History className="w-5 h-5" />
              </button>
            )}

            {messages.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 text-gray-600 hover:text-red-500 
                  transition-all duration-200 
                  hover:bg-red-50 rounded-lg
                  transform hover:scale-110"
                title="清除会话"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="flex-1">
              <ChatInput onSend={sendMessage} disabled={isLoading || !isOnline} />
            </div>
          </div>
        </div>
      </div>

      {showUpload && (
        <FileUpload
          onClose={() => setShowUpload(false)}
          onUpload={handleFileUpload}
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-pop">
            <h3 className="text-lg font-semibold mb-4">确认清除会话</h3>
            <p className="text-gray-600 mb-6">
              确定要清除所有聊天记录吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}