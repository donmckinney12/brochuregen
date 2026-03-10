/**
 * Production API Configuration (v27.4)
 * Centralizes API URL management and provides environment-aware warnings.
 */

const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocal = !hostname || hostname === 'localhost' || hostname === '127.0.0.1';
    const prodBackend = 'https://brochuregen-backend-dm.fly.dev';

    // 1. If we are local, use the environment variable or localhost:8000 fallback
    if (isLocal) {
        return envUrl || 'http://localhost:8000';
    }

    // 2. If we are in PRODUCTION (anything not local)
    // We MUST use the Fly.io backend if the envUrl is missing, points to localhost, or points to Clerk.
    const isInvalidProdUrl = !envUrl || envUrl.includes('localhost') || envUrl.includes('clerk');

    if (isInvalidProdUrl) {
        if (typeof window !== 'undefined') {
            console.warn(`🛡️ [PRODUCTION SECURITY OVERRIDE] API target forced to: ${prodBackend}`);
        }
        return prodBackend;
    }

    return envUrl;
};

export const API_URL = getApiUrl();

export const isProduction = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
};
