"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />

            {/* Hero */}
            <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-2">
                    Accepting Early Access
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Build with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">BrochureGen API</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Integrate automated brochure generation into your CRM, listing platform, or real estate app with just a few lines of code.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        Request API Key
                    </Link>
                    <Link href="#docs" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        View Documentation
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20" id="docs">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Features */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Lightning Fast Generation</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Our optimized engine generates print-ready PDFs in under 15 seconds. Perfect for on-demand generation in your application.
                            </p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">White Label Ready</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Remove all BrochureGen branding and use your main color palette. The generated PDFs look like they came directly from your brand.
                            </p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Enterprise Security</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                SOC2 compliant infrastructure. Your data is encrypted at rest and in transit. We never store customer PI data longer than necessary.
                            </p>
                        </div>
                    </div>

                    {/* Code Example */}
                    <div className="bg-slate-900 rounded-3xl p-8 overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-auto text-xs font-mono text-slate-500">POST /v1/generate</div>
                        </div>
                        <div className="font-mono text-sm text-slate-300 overflow-x-auto">
                            <pre>
                                {`curl -X POST https://api.brochuregen.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://zillow.com/listing/123",
    "template": "real-estate-one-pager",
    "brand_color": "#2563EB",
    "webhook_url": "https://yourapp.com/hooks/brochure"
  }'`}
                            </pre>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-800">
                            <div className="text-xs font-mono text-slate-500 mb-2">RESPONSE</div>
                            <div className="font-mono text-sm text-green-400">
                                <pre>
                                    {`{
  "id": "br_8a7d9f2e",
  "status": "processing",
  "eta": "12s"
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
