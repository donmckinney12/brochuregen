"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; link?: { url: string; label: string } }[]>([
        { role: 'ai', text: "Hi there! 👋 I'm the BrochureGen Assistant. How can I help you today?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleQuestion = (question: string) => {
        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: question }]);
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            let response = { text: "", link: undefined as { url: string; label: string } | undefined };

            switch (question) {
                case "How much does it cost?":
                    response = {
                        text: "We have flexible plans starting at $25/mo for individuals. You can also try it for free!",
                        link: { url: "/pricing", label: "View Pricing" }
                    };
                    break;
                case "How does it work?":
                    response = {
                        text: "It's simple: Paste any URL, and our AI scans the content to design a professional brochure in seconds. No design skills needed.",
                        link: { url: "/#how-it-works", label: "See How It Works" }
                    };
                    break;
                case "Can I customize the design?":
                    response = {
                        text: "Absolutely! Once generated, you can edit text, swap images, and change colors in our easy-to-use editor.",
                        link: undefined
                    };
                    break;
                case "Do you have an API?":
                    response = {
                        text: "Yes! Developers can use our API to generate brochures programmatically.",
                        link: { url: "/developers", label: "API Docs" }
                    };
                    break;
                default:
                    response = { text: "I'm not sure about that one, but our support team can help!", link: { url: "/contact", label: "Contact Support" } };
            }

            setMessages(prev => [...prev, { role: 'ai', text: response.text, link: response.link }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-900 w-80 md:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">BrochureGen AI</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-blue-100 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950/50 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'ai'
                                        ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                        : 'bg-blue-600 text-white rounded-tr-none'
                                    }`}>
                                    <p>{msg.text}</p>
                                    {msg.link && (
                                        <Link href={msg.link.url} className={`mt-2 inline-block text-xs font-bold underline ${msg.role === 'ai' ? 'text-blue-600 dark:text-blue-400' : 'text-white'}`}>
                                            {msg.link.label}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Suggested Questions:</p>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleQuestion("How much does it cost?")} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-colors">
                                💰 Pricing?
                            </button>
                            <button onClick={() => handleQuestion("How does it work?")} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-colors">
                                ⚙️ How it works?
                            </button>
                            <button onClick={() => handleQuestion("Do you have an API?")} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-colors">
                                🔌 API?
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto ${isOpen
                        ? 'bg-slate-800 text-white rotate-90'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-bounce-subtle'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                )}
            </button>
        </div>
    );
}
