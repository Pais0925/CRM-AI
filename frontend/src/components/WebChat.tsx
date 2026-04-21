"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, X } from 'lucide-react';

export default function WebChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Hi there! I am Hermes AI. How can I help you regarding your sales or integration today?' }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate Agent typing & response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { role: 'agent', content: 'I am processing your request. One moment please while I fetch the information from your knowledge base...' }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-[350px] h-[500px] mb-4 flex flex-col shadow-2xl border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="p-4 bg-white border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                H
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold text-slate-800">Hermes AI</CardTitle>
                <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-slate-400 hover:text-slate-600 h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'self-end bg-indigo-600 text-white rounded-br-sm' 
                    : 'self-start bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </CardContent>
          
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Hermes..." 
                className="pr-10 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-indigo-600 shadow-none text-sm h-10"
              />
              <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button 
        onClick={toggleChat} 
        className={`w-14 h-14 rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-white text-slate-800 border border-slate-200 rotate-90 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}
