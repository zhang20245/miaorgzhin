import { Message } from '../types/api';
import { Cat, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-in`}>
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 animate-bounce-in">
        {isUser ? <User className="w-5 h-5" /> : <Cat className="w-5 h-5" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap transform transition-all duration-200 hover:scale-[1.02] ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}