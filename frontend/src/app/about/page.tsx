import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Empowering Every Business to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            Look Professional
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We believe that great design shouldn't be a luxury. BrochureGen makes professional marketing materials accessible to everyone, instantly.
                    </p>
                </div>

                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {/* Mission Section */}
                    <section className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Starting a business is hard enough without worrying about design fees or learning complex software.
                            <span className="font-semibold text-slate-900 dark:text-white"> BrochureGen</span> was born from a simple idea:
                            what if your website could design its own marketing materials? By leveraging advanced AI, we turn your existing digital presence into
                            print-ready assets in seconds, letting you focus on what you do best—running your business.
                        </p>
                    </section>

                    {/* Why Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <span className="text-purple-600">⚡</span>
                                Speed & Efficiency
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Traditional design takes days. We take seconds. Get hi-res PDFs ready for print or digital sharing instantly.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <span className="text-pink-600">🎨</span>
                                Brand Consistency
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Our AI analyzes your brand colors, fonts, and imagery to ensure every brochure looks like it came from your design team.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <Link href="/" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-lg">
                        Create Your Brochure Now
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
