import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { geminiService, Message } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function ChatTool() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your OmniAI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass history excluding the very last user message we just added locally for display,
      // actually the service handles history, but let's pass the context correctly.
      // The service implementation I wrote takes history + new message.
      const history = messages; 
      const responseText = await geminiService.chat(history, userMsg.text);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText || "I couldn't generate a response." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-medium text-zinc-200">Interactive Chat</h2>
        </div>
        <div className="text-xs text-zinc-500">Gemini 3 Flash</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={cn(
              "flex gap-4 max-w-3xl",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
              msg.role === 'user' 
                ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
                : "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-zinc-800 text-zinc-100 rounded-tr-sm" 
                : "bg-zinc-900/80 border border-white/5 text-zinc-300 rounded-tl-sm"
            )}>
              <ReactMarkdown 
                components={{
                  code: ({node, ...props}) => <code className="bg-black/30 rounded px-1 py-0.5 text-xs font-mono text-indigo-300" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-3xl"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-zinc-900/80 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
