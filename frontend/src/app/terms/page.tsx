"use client";
import Navbar from "@/components/Navbar";

export default function TermsOfService() {
    return (
        <div className="min-h-screen text-[var(--foreground)] font-sans text-sm md:text-base bg-transparent">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Vault Node</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">Terms of Service</h1>
                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Last Sync: February 6, 2026</p>
                </header>

                <article className="prose prose-invert max-w-none text-white/60 space-y-12">
                    <section className="p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                        <p className="text-sm leading-relaxed">
                            Please read these Terms of Service ("Terms") carefully before using the BrochureGen website operated by BrochureGen.
                        </p>
                    </section>
                    <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
                    </p>

                    <h3>1. Accounts</h3>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>

                    <h3>2. Subscription and Payments</h3>
                    <p>
                        Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis (such as monthly or annually). You may cancel your Subscription at any time.
                    </p>

                    <h3>3. Intellectual Property</h3>
                    <p>
                        The Service and its original content, features, and functionality are and will remain the exclusive property of BrochureGen and its licensors. The brochures you generate using your own content remain your property.
                    </p>

                    <h3>4. Termination</h3>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        In no event shall BrochureGen, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h3>6. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>

                    <h3>7. Changes</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:support@brochuregen.com">support@brochuregen.com</a>.
                    </p>
                </article>
            </main>
        </div>
    );
}
