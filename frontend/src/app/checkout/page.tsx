"use client";
import React, { Suspense, useState, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

// Define plan details
const PLANS = {
    starter: { name: "Starter Plan", price: 25, features: ["5 Brochures/mo", "PDF Export"] },
    professional: { name: "Professional Plan", price: 49, features: ["Unlimited Exports", "AI Brand Scanning"] },
    agency: { name: "Agency Plan", price: 199, features: ["Team Collaboration", "API Access"] },
};

function CheckoutContent() {
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "google">("card");
    const searchParams = useSearchParams();

    // Initialize plan from URL, but allow it to be null
    const initialPlanId = searchParams.get("plan") as keyof typeof PLANS;
    const [selectedPlanId, setSelectedPlanId] = useState<keyof typeof PLANS | null>(PLANS[initialPlanId] ? initialPlanId : null);

    const selectedPlan = selectedPlanId ? PLANS[selectedPlanId] : null;

    return (
        <div className="min-h-screen transition-colors duration-300 ease-in-out font-sans bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 dark:bg-slate-950 dark:text-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <Link href="/pricing" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors group">
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Pricing
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Complete Your Order</h1>
                    <p className="text-slate-500 dark:text-slate-400">Choose your preferred payment method.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Order Summary */}
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>

                            {selectedPlan ? (
                                <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 animate-in fade-in">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg ${selectedPlanId === 'agency' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : selectedPlanId === 'starter' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'} flex items-center justify-center`}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{selectedPlan.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Subscription</p>
                                            </div>
                                            <ul className="space-y-1 mt-2">
                                                {selectedPlan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => setSelectedPlanId(null)}
                                                className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline mt-3 block"
                                            >
                                                Remove Plan
                                            </button>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">${selectedPlan.price}.00</span>
                                </div>
                            ) : (
                                <div className="py-8 text-center border-b border-slate-100 dark:border-slate-700 border-dashed animate-in fade-in">
                                    <p className="text-slate-500 dark:text-slate-400 mb-2">No plan selected</p>
                                    <a href="/pricing" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Browse Plans</a>
                                </div>
                            )}

                            <div className="py-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span>${selectedPlan?.price || 0}.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                                    <span className="text-xs text-slate-500">USD</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${selectedPlan?.price || 0}.00</span>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-sm text-blue-700 dark:text-blue-300">You won't be charged until your 7-day free trial ends. Cancel anytime.</p>
                        </div>

                    </div>

                    {/* Payment Details */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Details</h2>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    Secure 256-bit SSL
                                </div>
                            </div>

                            {/* Payment Method Tabs */}
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <button
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === "card" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600"}`}
                                >
                                    <svg className={`w-6 h-6 mb-1 ${paymentMethod === "card" ? "text-blue-600 dark:text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                    </svg>
                                    <span className={`text-xs font-semibold ${paymentMethod === "card" ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"}`}>Card</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("paypal")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === "paypal" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600"}`}
                                >
                                    {/* Simple PayPal Icon */}
                                    <svg className={`w-6 h-6 mb-1 ${paymentMethod === "paypal" ? "text-[#003087]" : "text-slate-500"}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.05-4.336 6.794-9.02 6.794H9.73l-1.353 8.57c-.041.26-.268.455-.532.455h-.768v-.016z" />
                                    </svg>
                                    <span className={`text-xs font-semibold ${paymentMethod === "paypal" ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"}`}>PayPal</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("google")}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === "google" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600"}`}
                                >
                                    <svg className={`w-6 h-6 mb-1 ${paymentMethod === "google" ? "text-slate-900 dark:text-white" : "text-slate-500"}`} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                                    </svg>
                                    <span className={`text-xs font-semibold ${paymentMethod === "google" ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"}`}>Google Pay</span>
                                </button>
                            </div>

                            {/* Credit Card Form */}
                            {paymentMethod === "card" && (
                                <form className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400 transition-all font-medium" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                                        <div className="relative">
                                            <input type="text" className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition-all" placeholder="0000 0000 0000 0000" />
                                            <svg className="w-6 h-6 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition-all" placeholder="MM/YY" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition-all" placeholder="123" />
                                        </div>
                                    </div>

                                    <button
                                        disabled={!selectedPlan}
                                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                        {selectedPlan ? 'Start Free Trial' : 'Select a Plan to Continue'}
                                    </button>
                                </form>
                            )}

                            {/* PayPal View */}
                            {paymentMethod === "paypal" && (
                                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-full p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl mb-6 text-center">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">You will be redirected to PayPal to verify your account.</p>
                                    </div>
                                    <button
                                        disabled={!selectedPlan}
                                        className="w-full py-4 rounded-full bg-[#FFC439] text-black font-bold hover:bg-[#FFD166] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="italic font-serif">Pay with</span>
                                        <span className="font-bold text-[#003087]">PayPal</span>
                                    </button>
                                </div>
                            )}

                            {/* Google Pay View */}
                            {paymentMethod === "google" && (
                                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl mb-6 text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Secure checkout with Google Pay.</p>
                                    </div>
                                    <button
                                        disabled={!selectedPlan}
                                        className="w-full py-4 rounded-full bg-black text-white font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                                        </svg>
                                        Pay with GPay
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                                <p className="text-xs text-slate-400 dark:text-slate-500">By confirming your subscription, you allow BrochureGen to charge your card for this payment and future payments in accordance with our terms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Checkout() {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}
