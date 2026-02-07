"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const TEMPLATES = [
    {
        id: "real-estate-one-pager",
        name: "Real Estate One-Pager",
        category: "Real Estate",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        description: "Perfect for single property listings. Highlights hero image and key specs."
    },
    {
        id: "corporate-profile",
        name: "Corporate Profile",
        category: "Business",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        description: "Professional layout for company overviews and team introductions."
    },
    {
        id: "restaurant-menu",
        name: "Restaurant Menu",
        category: "Hospitality",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Elegant menu design with sections for appetizers, mains, and drinks."
    },
    {
        id: "event-flyer",
        name: "Event Flyer",
        category: "Events",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
        description: "Eye-catching design for conferences, parties, and meetups."
    },
    {
        id: "product-catalog",
        name: "Product Catalog",
        category: "Retail",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        description: "Clean grid layout to showcase your product line with pricing."
    },
    {
        id: "travel-guide",
        name: "Travel Guide",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
        description: "Inspiring layout for destination guides and tour packages."
    }
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Templates</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Choose from our library of professionally designed templates. Our AI automatically adapts your content to fit perfectly.
                    </p>
                </div>

                {/* Filter Tabs (Visual Only for now) */}
                <div className="flex justify-center gap-2 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 flex-wrap">
                    {["All", "Real Estate", "Business", "Hospitality", "Events", "Retail"].map((category, i) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TEMPLATES.map((template, index) => (
                        <div key={template.id} className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8`} style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Link href="/" className="bg-white text-slate-900 font-bold py-2 px-6 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        Use Template
                                    </Link>
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {template.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{template.name}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <h2 className="text-2xl font-bold mb-4">Don't see what you need?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
                        We add new templates weekly. Suggestions are always welcome!
                    </p>
                    <Link href="/contact" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold">
                        Request a Template <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
