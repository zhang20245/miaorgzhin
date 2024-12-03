import { Message } from '../types/api';
import { Bot, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import { ReactNode, ComponentPropsWithoutRef, FC } from 'react';

interface ChatMessageProps {
  message: Message;
}

interface CodeComponentProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
  [key: string]: any;
}

// Use more specific type definitions
type CommonProps = React.HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const markdownComponents: Components = {
    code: ({ node: _, inline, className, children, ...props }: CodeComponentProps) => {
      // Rest of the code remains the same
    },

    p: (props: CommonProps) => (
      <p className="my-2 animate-fade-in" {...props}>
        {props.children}
      </p>
    ),

    h1: (props: CommonProps) => (
      <h1 className="text-2xl font-bold my-4 animate-slide-in" {...props}>
        {props.children}
      </h1>
    ),

    // Similar changes for h2, h3, ul, ol, li, a, blockquote, table, th, td
    // Use the refined CommonProps or AnchorProps as appropriate
  };

  // Rest of the component remains the same
}
