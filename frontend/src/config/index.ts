/**
 * API Configuration
 * Reads NEXT_PUBLIC_API_URL from environment. Falls back to localhost for local dev.
 */

const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocal = !hostname || hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocal) {
        return envUrl || 'http://localhost:8002';
    }

    if (!envUrl || envUrl.includes('localhost')) {
        if (typeof window !== 'undefined') {
            console.warn('NEXT_PUBLIC_API_URL is not set. Please configure it in your deployment environment.');
        }
        return '';
    }

    return envUrl;
};

export const API_URL = getApiUrl();

export const isProduction = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
};

export * from './tiers';
