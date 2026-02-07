"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RealEstateGuideArticle() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
                    <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white">Real Estate Guide</span>
                </div>

                {/* Header */}
                <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
                        <span className="bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md">Real Estate</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400">5 min read</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        How to Design a Real Estate Brochure in 5 Minutes with AI
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            BG
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">BrochureGen Team</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Published Feb 6, 2026</p>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700 delay-50">
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                        alt="Modern Real Estate Interior"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Content */}
                <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <p className="lead text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        In the fast-paced world of real estate, speed is everything. Getting a property on the market with high-quality marketing materials can mean the difference between a quick sale and a stale listing. But hiring a designer for every property is expensive, and DIY design tools have a steep learning curve.
                    </p>

                    <p>
                        Enter <strong>BrochureGen</strong>. Our AI-powered platform lets you turn any property listing URL into a stunning, print-ready PDF brochure in seconds. Here’s how to do it.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Step 1: Grab Your Listing URL</h2>
                    <p>
                        You probably already have your property listed on Zillow, Redfin, or your agency's website. simply copy that URL. BrochureGen works best with pages that have high-quality photos and clear descriptions.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Step 2: Paste and Generate</h2>
                    <p>
                        Head over to the <Link href="/" className="text-blue-600 hover:underline">BrochureGen Dashboard</Link>. Paste your URL into the input box and hit the <strong>Generate</strong> button.
                    </p>
                    <p>
                        Our AI engine will immediately start scanning the page. It identifies:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Key Details:</strong> Price, address, square footage, bedrooms/bathrooms.</li>
                        <li><strong>High-Res Images:</strong> It grabs the best photos for the brochure layout.</li>
                        <li><strong>Description:</strong> It summarizes your listing description into catchy marketing copy.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Step 3: Review and Export</h2>
                    <p>
                        In about 10-15 seconds, you'll see a live preview of your brochure. We offer a specialized "Real Estate One-Pager" template that puts the hero image front and center, with a clean sidebar for property specs.
                    </p>
                    <p>
                        If everything looks good, just click <strong>Download PDF</strong>. The file is CMYK-ready, meaning you can send it directly to a professional printer or print it in your office.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Why AI Matters for Realtors</h2>
                    <p>
                        Automation isn't just about saving time (though saving 2-3 hours per listing is huge). It's about consistency. Every brochure you produce needs to look professional and on-brand. AI ensures that your font choices, layout alignment, and image quality are perfect every single time.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border-l-4 border-blue-600 dark:border-blue-500 my-12 not-prose">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Ready to try it?</h3>
                        <p className="text-blue-800 dark:text-blue-200 mb-4">
                            You can generate your first brochure for free right now. No sign-up required to test the preview.
                        </p>
                        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md">
                            Create a Brochure Now
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
