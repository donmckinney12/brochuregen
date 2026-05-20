"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Truck, 
    Printer, 
    CheckCircle, 
    Layers, 
    MapPin, 
    ChevronRight, 
    Package,
    Loader2,
    ShieldCheck,
    Box
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

interface FulfillmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    brochureId: number;
    brochureTitle: string;
}

const PAPER_STOCKS = [
    { id: '100lb-silk', name: '100lb Silk Cover', desc: 'Premium smooth finish for high readability', price: 0.85 },
    { id: '80lb-matte', name: '80lb Matte Stock', desc: 'Non-reflective elite feel, perfect for corporate', price: 0.65 },
    { id: 'high-gloss', name: 'Premium High-Gloss', desc: 'Vibrant color pop, ultra premium look', price: 1.10 }
];

const FINISHES = [
    { id: 'uv-gloss', name: 'UV Gloss Coating', desc: 'Added durability and shine' },
    { id: 'matte-lam', name: 'Matte Lamination', desc: 'Velvet touch, luxury texture' },
    { id: 'none', name: 'Natural / No Finish', desc: 'Original paper texture' }
];

export default function FulfillmentModal({ isOpen, onClose, brochureId, brochureTitle }: FulfillmentModalProps) {
    const { getToken } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [orderData, setOrderData] = useState({
        quantity: 100,
        paperStock: '100lb Silk Cover',
        finish: 'UV Gloss Coating',
        shippingAddress: ''
    });

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/fulfillment/order`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    brochure_id: brochureId,
                    quantity: orderData.quantity,
                    paper_stock: orderData.paperStock,
                    finish: orderData.finish,
                    shipping_address: orderData.shippingAddress
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Fulfillment request failed');
            }

            setOrderSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
            >
                {/* Visual Sidebar */}
                <div className="w-full md:w-80 bg-gradient-to-br from-[var(--foreground)]/10 to-transparent p-12 border-b md:border-b-0 md:border-r border-[var(--glass-border)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-[80px]" />
                    
                    <div className="relative z-10 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Printer className="text-[var(--accent-primary)]" size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/50">Service</span>
                            </div>
                            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase italic leading-none">
                                Premium <br/>
                                <span className="gradient-text">Fulfillment</span>
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                { step: 1, label: 'Specifications', icon: Layers },
                                { step: 2, label: 'Logistics', icon: Truck },
                                { step: 3, label: 'Confirmation', icon: ShieldCheck }
                            ].map((s) => (
                                <div key={s.step} className={`flex items-center gap-4 transition-all ${step === s.step ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${step === s.step ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]' : 'border-[var(--glass-border)]'}`}>
                                        <s.icon size={14} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 p-6 bg-[var(--foreground)]/[0.03] border border-[var(--glass-border)] rounded-2xl">
                        <p className="text-[9px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest mb-1">Active Asset</p>
                        <p className="text-[11px] font-black text-[var(--foreground)] uppercase truncate">{brochureTitle}</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col relative">
                    <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-2xl transition-all z-20">
                        <X size={20} />
                    </button>

                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {orderSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-8"
                                >
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                                        <CheckCircle size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">Order Processing</h3>
                                        <p className="text-xs font-bold text-[var(--foreground)]/60 uppercase tracking-widest">Your physical assets have been queued for global fulfillment.</p>
                                    </div>
                                    <button 
                                        onClick={onClose}
                                        className="px-12 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
                                    >
                                        Return to Dashboard
                                    </button>
                                </motion.div>
                            ) : step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-widest ml-2">Print Quantity</label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="range" 
                                                    min="50" 
                                                    max="5000" 
                                                    step="50"
                                                    value={orderData.quantity}
                                                    onChange={(e) => setOrderData({...orderData, quantity: parseInt(e.target.value)})}
                                                    className="flex-1 h-2 bg-[var(--foreground)]/10 rounded-full appearance-none cursor-pointer accent-[var(--accent-primary)]"
                                                />
                                                <div className="w-24 p-3 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl text-center">
                                                    <span className="text-sm font-black text-[var(--foreground)]">{orderData.quantity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-widest ml-2">Paper Selection</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {PAPER_STOCKS.map((stock) => (
                                                    <button
                                                        key={stock.id}
                                                        onClick={() => setOrderData({...orderData, paperStock: stock.name})}
                                                        className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group ${orderData.paperStock === stock.name ? 'bg-[var(--foreground)]/5 border-[var(--accent-primary)]' : 'bg-transparent border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'}`}
                                                    >
                                                        <div>
                                                            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)]">{stock.name}</p>
                                                            <p className="text-[9px] font-bold text-[var(--foreground)]/40 uppercase tracking-tighter mt-1">{stock.desc}</p>
                                                        </div>
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${orderData.paperStock === stock.name ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--glass-border)] group-hover:border-[var(--glass-border-hover)]'}`}>
                                                            {orderData.paperStock === stock.name && <CheckCircle size={10} className="text-white" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-widest ml-2">Finishing Protocol</label>
                                            <select 
                                                value={orderData.finish}
                                                onChange={(e) => setOrderData({...orderData, finish: e.target.value})}
                                                className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest outline-none appearance-none"
                                            >
                                                {FINISHES.map(f => <option key={f.id} value={f.name} className="bg-[var(--background)]">{f.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-6">
                                        <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                                <Truck size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[var(--foreground)] uppercase italic tracking-tighter">Global Shipping Protocol</h4>
                                                <p className="text-[10px] font-bold text-[var(--foreground)]/50 uppercase tracking-widest leading-relaxed">Enter your institutional delivery address. We fulfill orders across 190+ jurisdictions.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-widest ml-2">Delivery Coordinates</label>
                                            <textarea 
                                                value={orderData.shippingAddress}
                                                onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
                                                placeholder="Street Address, City, State, ZIP, Country..."
                                                className="w-full h-48 bg-[var(--foreground)]/5 border border-[var(--glass-border)] p-8 rounded-[2.5rem] text-sm font-bold text-[var(--foreground)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none resize-none placeholder:text-[var(--foreground)]/20"
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase text-center tracking-widest">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {!orderSuccess && (
                        <div className="p-12 pt-0 flex gap-4">
                            {step > 1 && (
                                <button 
                                    onClick={handleBack}
                                    className="px-10 py-5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/60 rounded-3xl font-black uppercase tracking-widest text-[9px] transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button 
                                onClick={step === 1 ? handleNext : handleSubmit}
                                disabled={loading || (step === 2 && !orderData.shippingAddress)}
                                className="flex-1 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-30"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (step === 1 ? <ChevronRight size={16} /> : <Box size={16} />)}
                                <span>{step === 1 ? 'Configure Delivery' : 'Finalize Request'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
