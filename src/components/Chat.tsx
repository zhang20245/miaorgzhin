import { useState, useEffect, useRef } from 'react';
import { Message } from '../types/api';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Cat } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_KEY = 'fw_3ZmSQNfB8bV5irULEe3pE31V';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleError = (error: any): string => {
    if (!API_KEY) return '请先设置 API 密钥才能开始对话。';
    if (!navigator.onLine) return '网络连接已断开，请检查您的网络连接后重试。';
    if (error?.response?.status === 401) return 'API 密钥无效或已过期，请检查您的 API 密钥。';
    if (error?.response?.status === 429) return 'API 调用频率超限，请稍后再试。';
    if (typeof error?.message === 'string') return `服务器错误：${error.message}`;
    return '抱歉，服务出现了问题。请稍后重试。';
  };

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    const newMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      if (!API_KEY) throw new Error('API_KEY_MISSING');

      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'accounts/fireworks/models/qwen2p5-coder-32b-instruct',
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [newMessage],
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API_ERROR');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: handleError(error)
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!API_KEY) {
      setMessages([{
        role: 'assistant',
        content: '请先设置 API 密钥才能开始对话。'
      }]);
    }
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <Cat className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce-in" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2 animate-slide-in">
                你好！我是喵哥
              </h2>
              <p className="text-gray-500 mb-4 animate-slide-in">
                让我们开始对话吧！
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </>
  );
}