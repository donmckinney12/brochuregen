import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Refund Policy - BrochureGen AI',
    description: 'Our refund policy and satisfaction guarantee.',
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Refund Policy
                </h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-12">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p>
                        At BrochureGen AI, we strive to provide high-quality services and ensure customer satisfaction. This Refund Policy outlines the terms under which refunds may be granted.
                    </p>

                    <h3>1. Satisfaction Guarantee & 7-Day Trial</h3>
                    <p>
                        We offer a <strong>7-day money-back guarantee</strong> on all first-time subscriptions. If you are not satisfied with our service within the first 7 days of your initial purchase, you may request a full refund, no questions asked.
                    </p>
                    <p>
                        For deployments with a free trial period, you will not be charged until the trial period ends. You may cancel at any time during the trial to avoid being charged.
                    </p>

                    <h3>2. Eligibility for Refunds</h3>
                    <ul>
                        <li><strong>First-Time Subscribers:</strong> Eligible for a full refund within 7 days of the initial charge.</li>
                        <li><strong>Technical Issues:</strong> If you experience persistent technical errors that prevent you from using the core features of the service, and our support team is unable to resolve them within a reasonable timeframe, you may be eligible for a partial or full refund.</li>
                        <li><strong>Duplicate Charges:</strong> If you are accidentally charged twice for the same billing period, we will refund the duplicate charge immediately.</li>
                    </ul>

                    <h3>3. Non-Refundable Circumstances</h3>
                    <p>
                        Refunds are generally not granted in the following situations:
                    </p>
                    <ul>
                        <li>Requests made more than 7 days after the initial purchase.</li>
                        <li>Renewal charges for ongoing subscriptions where cancellation was not requested before the renewal date.</li>
                        <li>Violation of our Terms of Service.</li>
                    </ul>

                    <h3>4. How to Request a Refund</h3>
                    <p>
                        To request a refund, please contact our support team at <a href="mailto:support@brochuregen.ai" className="text-blue-600 dark:text-blue-400 hover:underline">support@brochuregen.ai</a> with your account email and order details.
                    </p>

                    <h3>5. Processing Time</h3>
                    <p>
                        Approved refunds are typically processed within 5-10 business days, depending on your bank or credit card provider.
                    </p>

                    <hr className="my-8 border-slate-200 dark:border-slate-800" />

                    <p className="text-sm text-slate-500">
                        BrochureGen AI reserves the right to update this policy at any time. Changes will be effective immediately upon posting to this page.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
