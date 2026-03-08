"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { Bot, Send, X, Sparkles, Loader2, MessageCircle } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatPanel() {
    const { getToken } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', role: 'assistant', content: "Hey! I'm BrochureGen AI. Ask me anything about creating brochures, marketing copy, or using the platform. 🚀" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: 'user',
            content: input.trim(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/chat/message`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ message: userMsg.content }),
                }
            );

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    id: `a-${Date.now()}`,
                    role: 'assistant',
                    content: data.reply,
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: `e-${Date.now()}`,
                    role: 'assistant',
                    content: "Sorry, I couldn't process that. Please try again.",
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: `e-${Date.now()}`,
                role: 'assistant',
                content: "Connection error. Please check your network.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            >
                {isOpen ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
            </button>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-[100] w-[360px] h-[500px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--glass-border)] flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">AI Assistant</p>
                                <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                            <Sparkles size={14} className="text-purple-400 ml-auto" />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-500 text-white rounded-br-sm'
                                            : 'bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-bl-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl rounded-bl-sm">
                                        <Loader2 size={14} className="animate-spin text-purple-400" />
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-[var(--glass-border)]">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl py-2.5 px-4 text-xs text-[var(--foreground)] placeholder:opacity-30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-30"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
