import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    showText?: boolean;
    showEnterprise?: boolean;
    height?: number;
    width?: number;
}

export default function Logo({ 
    className = "", 
    showText = true, 
    showEnterprise = true,
    height = 40,
    width = 160
}: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer group"
            >
                <div className="relative overflow-hidden">
                    <img 
                        src="/brochuregen.png" 
                        alt="BrochureGen Logo" 
                        className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    />
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
            </motion.div>
            
            {showEnterprise && (
                <div className="hidden md:flex flex-col border-l border-white/10 pl-3">
                    <span className="text-[8px] font-black tracking-[0.4em] text-purple-400/60 uppercase">
                        Enterprise
                    </span>
                    <span className="text-[8px] font-black tracking-[0.4em] text-white/40 uppercase -mt-0.5">
                        Genesis
                    </span>
                </div>
            )}
        </div>
    );
}

