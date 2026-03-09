/**
 * Production API Configuration (v27.4)
 * Centralizes API URL management and provides environment-aware warnings.
 */

const getApiUrl = (): string => {
    // 1. Check environment variable (Priority)
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // 2. Identify Host Context
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'node-server';
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const isProdOrigin = hostname.includes('brochuregen.com') || hostname.includes('netlify.app');

    // 3. Fallback logic
    // If we're on a local machine, default to local backend.
    // If we're on a production domain, we HAVE to have the envUrl or it will fail.
    const finalUrl = envUrl || 'http://localhost:8000';

    if (typeof window !== 'undefined') {
        if (isProdOrigin && (!envUrl || envUrl.includes('localhost'))) {
            console.error(
                `❌ [CRITICAL CONFIG ERROR] Production domain "${hostname}" is trying to connect to "${finalUrl}".\n` +
                `This WILL fail due to CORS and loopback restrictions.\n\n` +
                `FIX: You must set the "NEXT_PUBLIC_API_URL" environment variable in your Netlify/Vercel dashboard.\n` +
                `Expected Value: https://brochuregen-backend-dm.fly.dev`
            );
        } else if (!isLocal) {
            console.log(`🌐 Application running on "${hostname}". API target: "${finalUrl}"`);
        }
    }

    return finalUrl;
};

export const API_URL = getApiUrl();

export const isProduction = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
};
