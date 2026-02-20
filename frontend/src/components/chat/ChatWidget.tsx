import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ChatMessage } from '../../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ChatWidgetProps {
  productId: string;
}

const makeWelcomeMessage = (): ChatMessage => ({
  id: crypto.randomUUID(),
  role: 'assistant',
  content:
    "Hi! I've analyzed this product's reviews. Ask me anything — pros and cons, how it compares, whether it's right for your use case, or common issues buyers mention.",
});

export const ChatWidget = ({ productId }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([makeWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const historyToSend = messages
      .slice(1)
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantPlaceholder: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historyToSend }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();

          if (dataStr === '[DONE]') {
            setMessages((prev) =>
              prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
            );
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);

            if (parsed.error) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.isStreaming
                    ? { ...m, content: parsed.error, isStreaming: false, isError: true }
                    : m,
                ),
              );
              break;
            }

            if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.isStreaming ? { ...m, content: m.content + parsed.text } : m,
                ),
              );
            }
          } catch {
            // Malformed JSON in SSE data — skip
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;

      const errorText =
        err instanceof Error ? err.message : 'Failed to connect to the AI service.';

      setMessages((prev) =>
        prev.map((m) =>
          m.isStreaming
            ? { ...m, content: errorText, isStreaming: false, isError: true }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  }, [input, isStreaming, messages, productId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
          <Bot className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Ask About This Product
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Claude AI
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 p-6 overflow-y-auto max-h-[480px] min-h-[200px]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-brand-100 dark:bg-brand-900/30'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                }`}
              >
                {msg.content ||
                  (msg.isStreaming && (
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Thinking...
                    </span>
                  ))}
                {msg.isStreaming && msg.content && (
                  <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-surface-border dark:border-dark-border">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this product..."
            maxLength={2000}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none rounded-xl border border-surface-border dark:border-dark-border bg-surface-secondary dark:bg-dark-surface-secondary text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            size="md"
            className="flex-shrink-0 h-[42px] w-[42px] !px-0 flex items-center justify-center"
            aria-label="Send message"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Press Enter to send
        </p>
      </div>
    </div>
  );
};
