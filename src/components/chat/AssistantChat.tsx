import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../../services/ai';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

export function AssistantChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Hello! I am your Campus Smart Assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.askAssistant(input);
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: response || 'Sorry, I encountered an error.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
       console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-[#141414]/10 z-[100] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-royal text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sunflower">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Campus Assistant</h3>
                <p className="text-[10px] text-sunflower uppercase tracking-widest font-bold">Always Online</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                  msg.role === 'user' ? "bg-sunflower text-royal border border-royal/10" : "bg-royal text-white"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-sunflower text-royal rounded-tr-none shadow-sm font-semibold" 
                    : "bg-white border border-royal/5 text-royal shadow-sm rounded-tl-none font-medium"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-royal text-white flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-royal/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="animate-spin text-royal/30" size={16} />
                  <span className="text-xs text-royal/30 italic">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-royal/5 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-royal/10 transition-all">
              <input 
                type="text" 
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-royal/30 py-1 text-royal"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-royal text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 shadow-lg shadow-royal/20"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-center mt-3 text-royal/30 font-bold uppercase tracking-widest">AI Core v3.0</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
