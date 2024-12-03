import { Message } from '../types/api';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

interface ChatMessageProps {
  message: Message;
}

interface CodeComponentProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
  // Add any other custom props needed
  [key: string]: any;
}

interface CommonProps {
  children?: ReactNode;
  [key: string]: unknown;
}

interface AnchorProps extends CommonProps {
  href?: string;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Define markdown components with proper types
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

    p: ({ children, ...props }: CommonProps) => (
      <p className="my-2 animate-fade-in" {...props}>
        {children}
      </p>
    ),

    h1: ({ children, ...props }: CommonProps) => (
      <h1 className="text-2xl font-bold my-4 animate-slide-in" {...props}>
        {children}
      </h1>
    ),

    h2: ({ children, ...props }: CommonProps) => (
      <h2 className="text-xl font-bold my-3 animate-slide-in" {...props}>
        {children}
      </h2>
    ),

    h3: ({ children, ...props }: CommonProps) => (
      <h3 className="text-lg font-bold my-2 animate-slide-in" {...props}>
        {children}
      </h3>
    ),

    ul: ({ children, ...props }: CommonProps) => (
      <ul className="list-disc ml-4 my-2 animate-fade-in" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }: CommonProps) => (
      <ol className="list-decimal ml-4 my-2 animate-fade-in" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }: CommonProps) => (
      <li className="my-1 animate-slide-in" {...props}>
        {children}
      </li>
    ),

    a: ({ href, children, ...props }: AnchorProps) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline transition-all duration-200 ${
          isUser 
            ? 'text-white hover:text-blue-100' 
            : 'text-blue-600 hover:text-blue-800'
        } hover:scale-105 inline-block`}
        {...props}
      >
        {children}
      </a>
    ),

    blockquote: ({ children, ...props }: CommonProps) => (
      <blockquote
        className={`border-l-4 pl-3 my-2 transition-all duration-200 hover:scale-[1.01] ${
          isUser ? 'border-white/30' : 'border-gray-300'
        }`}
        {...props}
      >
        {children}
      </blockquote>
    ),

    table: ({ children, ...props }: CommonProps) => (
      <div className="my-2 overflow-x-auto animate-fade-in">
        <table className="min-w-full border-collapse transition-all duration-200 hover:shadow-md" {...props}>
          {children}
        </table>
      </div>
    ),

    th: ({ children, ...props }: CommonProps) => (
      <th
        className={`border px-4 py-2 transition-colors duration-200 ${
          isUser ? 'border-white/20' : 'border-gray-300'
        }`}
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }: CommonProps) => (
      <td
        className={`border px-4 py-2 transition-colors duration-200 ${
          isUser ? 'border-white/20' : 'border-gray-300'
        }`}
        {...props}
      >
        {children}
      </td>
    ),
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
}