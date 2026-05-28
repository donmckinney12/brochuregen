"use client";
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
    const pathname = usePathname();
    const appRoutes = ['/brand', '/command', '/dashboard', '/feedback', '/insights', '/leads', '/settings', '/templates'];
    const isAppRoute = appRoutes.some(route => pathname?.startsWith(route));

    if (isAppRoute) return null;
    return <Footer />;
}
