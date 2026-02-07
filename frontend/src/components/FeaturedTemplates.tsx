export default function FeaturedTemplates() {
    const templates = [
        {
            title: "Tri-Fold Brochure",
            category: "Marketing",
            image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80",
            color: "from-blue-500 to-indigo-500"
        },
        {
            title: "Real Estate One-Pager",
            category: "Sales",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            color: "from-emerald-500 to-teal-500"
        },
        {
            title: "Corporate Profile",
            category: "Business",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <section className="py-20">
            <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Professional Output</span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-4">Featured Templates</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Choose from our library of high-converting designs. Our AI automatically adapts your content to fit perfectly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {templates.map((template, index) => (
                    <div key={index} className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="aspect-[4/5] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                            <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-20 transition-opacity z-10`} />
                            {/* Placeholder for actual screenshot/image */}
                            <img
                                src={template.image}
                                alt={template.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold mb-2 border border-white/30">
                                    {template.category}
                                </span>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">{template.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
