"use client";
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-mono selection:bg-cyan-500/30 overflow-hidden relative">
            <Navbar />

            {/* Neural Data Stream Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
                <div className="grid grid-cols-12 h-full w-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-white/5 h-full relative">
                            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-cyan-500/20 to-transparent animate-falling-data" style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${2 + Math.random() * 2}s` }} />
                        </div>
                    ))}
                </div>
            </div>

            <main className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center z-10">
                <div className="relative mb-12 group">
                    <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter italic opacity-5 group-hover:opacity-10 transition-opacity">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">
                                Protocol Disconnected
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                                Lost in the <span className="gradient-text">Singularity</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <p className="text-white/40 font-bold uppercase tracking-[0.2em] max-w-md text-[10px] mb-12 leading-loose">
                    The requested node has been de-indexed or moved to a restricted sector. Neural pathways are being rerouted to primary command.
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                    <Link href="/" className="px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Return to Hub
                    </Link>
                    <Link href="/contact" className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all">
                        Support Relay
                    </Link>
                </div>
            </main>

            <style jsx>{`
                @keyframes falling-data {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(1000%); opacity: 0; }
                }
                .animate-falling-data {
                    animation: falling-data linear infinite;
                }
            `}</style>
        </div>
    )
}
