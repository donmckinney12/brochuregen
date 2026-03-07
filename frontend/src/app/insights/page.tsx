"use client";
import SuiteLayout from '@/components/SuiteLayout';
import InsightsDashboard from '@/components/InsightsDashboard';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
    const router = useRouter();

    return (
        <SuiteLayout>
            <InsightsDashboard onOpenVault={() => router.push('/brand')} />
        </SuiteLayout>
    );
}
