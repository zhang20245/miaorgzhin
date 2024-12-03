import React from 'react';
import { Message } from '../types/api';
import { Bot, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

interface CodeComponentProps extends React.ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const markdownComponents: Components = {
    code: ({ node: _, inline, className, children, ...props }: CodeComponentProps) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-2 animate-fade-in">
          <code
            className={`block p-2 rounded-lg overflow-x-auto transition-all duration-200 hover:shadow-md ${
              isUser ? 'bg-blue-400' : 'bg-gray-200'
            } ${match ? `language-${match[1]}` : ''}`}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </code>
        </div>
      ) : (
        <code
          className={`px-1 py-0.5 rounded transition-all duration-200 hover:scale-105 ${
            isUser ? 'bg-blue-400' : 'bg-gray-200'
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },
    // Rest of the markdownComponents remain the same
  };

  return (
    <div 
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-pop`}
    >
      <div 
        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 
          ${isUser ? 'animate-slide-in-left' : 'animate-slide-in-right'}
          hover:scale-110 transition-transform duration-200`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 animate-float" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 transform transition-all duration-300 
          hover:scale-[1.01] hover:shadow-lg
          ${isUser
            ? 'bg-blue-500 text-white rounded-br-none markdown-content-light animate-slide-in-left'
            : 'bg-gray-100 text-gray-800 rounded-bl-none markdown-content animate-slide-in-right'
          }`}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
          components={markdownComponents}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
