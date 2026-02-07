import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-6">Lost in the fold?</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
                    The page you're looking for seems to have been misplaced. Don't worry, even the best designs need a revision sometimes.
                </p>
                <div className="flex gap-4">
                    <Link href="/" className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        Return Home
                    </Link>
                    <Link href="/contact" className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}
