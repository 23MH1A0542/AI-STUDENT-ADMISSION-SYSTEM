import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, HelpCircle } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      message: 'Hello! I am the Zenith Admissions Assistant. How can I help you today with your applications, courses, or admissions requirements?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) setInput('');

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      message: text,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      const res = await aiAPI.chat(text);
      setMessages(prev => [...prev, {
        id: res.data.id || Date.now().toString() + '_bot',
        sender: 'bot',
        message: res.data.message,
        timestamp: new Date(res.data.timestamp)
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_err',
        sender: 'bot',
        message: 'Sorry, I am having trouble connecting to the server. Please try again in a few moments.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterQuestions = [
    "What is the GPA requirement?",
    "When is the application deadline?",
    "How can I upload documents?",
    "What is the tuition cost?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4 transition-all duration-200 ease-in-out transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="h-5 w-5 fill-white/10" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-sans">Admissions Assistant</h3>
                <span className="text-[10px] text-brand-100 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5 inline-block animate-pulse"></span>
                  Powered by Gemini AI {!isAuthenticated && '(Guest)'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-start max-w-[80%] space-x-2 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isBot ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isBot ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm' 
                          : 'bg-brand-600 text-white rounded-tr-none'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 max-w-[80%]">
                  <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompts */}
          {messages.length === 1 && !loading && (
            <div className="p-3 bg-white border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-400 mb-2 flex items-center">
                <HelpCircle className="h-3.5 w-3.5 mr-1" />
                Frequently Asked Questions
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {starterQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[10px] text-left p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 max-h-20 min-h-[36px] outline-none text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500 focus:bg-white resize-none"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center transition hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default Chatbot;
