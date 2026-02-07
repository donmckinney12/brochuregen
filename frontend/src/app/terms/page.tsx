"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm md:text-base">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-slate-500 dark:text-slate-400">Last Updated: February 6, 2026</p>
                </header>

                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <p>
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the BrochureGen website (the "Service") operated by BrochureGen ("us", "we", or "our").
                    </p>
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

            <Footer />
        </div>
    );
}
