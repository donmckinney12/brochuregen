"use client";
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            if (process.env.NODE_ENV === 'development') {
                // In development, we actively unregister any existing service workers 
                // to prevent stale caching issues.
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                        console.log('SW unregistered in dev mode');
                    }
                });
                return;
            }

            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((err) => {
                    console.log('SW registration failed:', err);
                });
        }
    }, []);

    return null;
}
