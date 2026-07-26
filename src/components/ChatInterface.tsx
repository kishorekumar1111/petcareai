import React, { useState, useRef, useEffect } from 'react';
import { PetProfile, ChatMessage } from '../types';
import { Send, Loader2, AlertTriangle, User } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  petProfile: PetProfile;
  onReset: () => void;
}

export default function ChatInterface({ petProfile, onReset }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Hello! I'm ready to help you take care of **${petProfile.name}**. You can ask me about nutrition, vaccinations, grooming, exercise, training, or general advice for a ${petProfile.breed}.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          petProfile
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages([...newMessages, {
        role: 'model',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, {
        role: 'model',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-[#FDFBF7]">
      {/* Profile Bar */}
      <div className="bg-[#F9F7F2] border-b border-[#E5E0D5] p-4 px-8 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#7D8471] flex items-center justify-center font-serif text-xl text-white shadow-sm">
            {petProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-serif text-xl text-[#3A3A2E] leading-tight mb-1">{petProfile.name}</div>
            <div className="text-xs text-[#7D8471] uppercase tracking-wider font-bold opacity-80">
              {petProfile.breed} • {petProfile.age} • {petProfile.weight}
            </div>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-sm text-[#7D8471] font-semibold px-4 py-2 rounded-xl border border-[#E5E0D5] bg-[#FAF9F6] hover:bg-[#F5F2ED] transition-colors cursor-pointer"
        >
          Switch Pet
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#E5E0D5] bg-opacity-30 p-2 text-center text-xs font-bold uppercase tracking-wider text-[#7D8471] flex items-center justify-center gap-2 border-b border-[#E5E0D5] shrink-0">
        <AlertTriangle className="w-3 h-3" />
        AI is not a substitute for professional veterinary advice
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FDFBF7] scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-[24px] px-6 py-5 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#7D8471] text-white rounded-tr-sm' 
                    : 'bg-white border border-[#E5E0D5] text-[#3A3A2E] rounded-tl-sm'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="text-sm leading-relaxed overflow-hidden [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>h1]:font-serif [&>h1]:text-xl [&>h1]:mb-2 [&>h2]:font-serif [&>h2]:text-lg [&>h2]:mb-2 [&>h3]:font-bold [&>strong]:font-semibold last:[&>*]:mb-0">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                )}
                <div className={`text-[10px] uppercase tracking-wider font-bold mt-3 ${msg.role === 'user' ? 'text-white opacity-60' : 'text-[#7D8471] opacity-50'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E0D5] rounded-[24px] rounded-tl-sm px-6 py-5 shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#7D8471]" />
                <span className="text-sm text-[#7D8471] italic">PetCare AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#E5E0D5] p-6 shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask about ${petProfile.name}...`}
            className="flex-1 max-h-32 min-h-[56px] resize-none rounded-2xl border border-[#E5E0D5] px-5 py-4 focus:outline-none focus:border-[#7D8471] focus:ring-1 focus:ring-[#7D8471] bg-[#FAF9F6] transition-all text-sm leading-relaxed text-[#3A3A2E] placeholder:opacity-50"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-[#7D8471] hover:bg-opacity-90 disabled:bg-[#E5E0D5] disabled:text-[#7D8471] text-white p-4 rounded-2xl transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
