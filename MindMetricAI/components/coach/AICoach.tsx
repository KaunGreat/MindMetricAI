
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { getCoachResponse, Message } from '../../utils/coachApi.ts';
import { TestResult } from '../../types.ts';

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestResult[];
}

const AICoach: React.FC<AICoachProps> = ({ isOpen, onClose, history }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your MindMetric Neural Coach. I've synced with your latest test results. How can I help you optimize your brain today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getCoachResponse(input, history);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the neural network right now. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Side Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Neural Coach</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Analysis</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                msg.role === 'assistant' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-slate-800/50 text-slate-200 border border-slate-800 rounded-tl-none' 
                  : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 animate-pulse">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-800">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/30">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your metrics..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-2xl py-4 pl-4 pr-14 text-white text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Powered by Neural Insight Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
