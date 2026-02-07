export default function HowItWorks() {
    const steps = [
        {
            title: "Paste URL",
            description: "Simply input your website or product URL. Our scraper safely extracts text, images, and brand colors.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            ),
            color: "bg-blue-500"
        },
        {
            title: "AI Generation",
            description: "Our AI analyzes your content, writes compelling copy, and organizes it into a professional layout.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            ),
            color: "bg-purple-500"
        },
        {
            title: "Export PDF",
            description: "Review your brochure, make quick edits if needed, and download a print-ready PDF instantly.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            ),
            color: "bg-pink-500"
        }
    ];

    return (
        <section className="py-20 bg-slate-50/50 dark:bg-white/5 border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider uppercase text-sm">Simple Process</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-3xl ${step.color} shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`}>
                                <div className="absolute inset-0 bg-white opacity-20 rounded-3xl group-hover:opacity-10 transition-opacity" />
                                {step.icon}
                                <div className="absolute -bottom-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-black shadow-sm border border-slate-100 dark:border-slate-700">
                                    Step {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
