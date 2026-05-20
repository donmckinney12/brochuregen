"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function BrandVoiceArticle() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
                    <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white">Brand Voice Guide</span>
                </div>

                <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
                        <span className="bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-md">Strategy</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400">6 min read</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Mastering Brand Voice: Maintaining Professional Consistency with AI
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                            BG
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">BrochureGen Strategy Team</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Published March 14, 2026</p>
                        </div>
                    </div>
                </header>

                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700 delay-50">
                    <img
                        src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&q=80"
                        alt="Professional Branding Concept"
                        className="w-full h-auto object-cover"
                    />
                </div>

                <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <p className="lead text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        In marketing, your voice is your identity. It's how your customers perceive your brand's personality and reliability. But as you scale, maintaining that voice across varied materials—from brochures to social media—becomes increasingly difficult.
                    </p>

                    <p>
                        With the rise of generative AI, the challenge has shifted. It's no longer just about writing content; it's about <strong>curating</strong> content that sounds like you. At BrochureGen, we've built tools to ensure that AI doesn't just write—it reflects your brand's unique character.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">The Importance of Tonality</h2>
                    <p>
                        A corporate real estate firm should not sound like a boutique coffee shop. One requires an authoritative, formal tone; the other benefit from something warm and approachable. Identifying your core tonality is the first step in creating a Brand Voice Guide.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">AI as a Mirror, Not a Replacement</h2>
                    <p>
                        The most common mistake businesses make with AI is using generic prompts. This results in generic content. To master your brand voice with AI, you need to provide the "input" that matters:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Sentence Structure:</strong> Does your brand use short, punchy sentences or longer, more descriptive ones?</li>
                        <li><strong>Vocabulary:</strong> Are there industry-specific terms you use, or do you prefer simple, direct language?</li>
                        <li><strong>Perspective:</strong> Do you speak in the first person ("We help you...") or the third person ("The firm provides...")?</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Using BrochureGen's Voice Trainer</h2>
                    <p>
                        Our platform includes a built-in voice analysis tool. By pointing BrochureGen to your existing website, the AI analyzes your current content and automatically adjusts its generation parameters to match. This ensures that every brochure created through our system sounds like it was written by your own marketing team.
                    </p>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border-l-4 border-indigo-600 dark:border-indigo-500 my-12 not-prose">
                        <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Want to see it in action?</h3>
                        <p className="text-indigo-800 dark:text-indigo-200 mb-4">
                            Try our Brand Voice Analysis tool for free and see how your automated content transforms.
                        </p>
                        <Link href="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md">
                            Analyze My Brand Voice
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}
