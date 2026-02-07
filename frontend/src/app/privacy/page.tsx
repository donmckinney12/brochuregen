"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm md:text-base">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400">Last Updated: February 6, 2026</p>
                </header>

                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <p>
                        At BrochureGen ("we", "us", or "our"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website brochuregen.com (the "Service").
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information that you provide to us directly, such as when you create an account, subscribe to a plan, or contact support.</p>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email address, and password.</li>
                        <li><strong>Payment Information:</strong> Credit card details and billing address (processed securely by our payment providers).</li>
                        <li><strong>Usage Data:</strong> Information about how you use our Service, such as the URLs you generate brochures from.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>We use your information to operate and improve our Service, including:</p>
                    <ul>
                        <li>Providing and maintaining the Service.</li>
                        <li>Processing your payments and managing your subscription.</li>
                        <li>Sending you administrative messages, updates, and security alerts.</li>
                        <li> responding to your comments and questions.</li>
                    </ul>

                    <h3>3. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                    </p>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We may use third-party services (such as analytics providers and payment processors) that collect, monitor, and analyze information. These third parties have their own privacy policies addressing how they use such information.
                    </p>

                    <h3>5. Changes to This Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@brochuregen.com">support@brochuregen.com</a>.
                    </p>
                </article>
            </main>

            <Footer />
        </div>
    );
}
