import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 animate-fade-in">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="问问喵哥..."
        className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-200"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="rounded-full p-2 bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}