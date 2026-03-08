import { notFound } from 'next/navigation';
import SharedViewClient from '@/components/SharedViewClient';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { share_uuid: string }
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/brochures/shared/${params.share_uuid}`, { next: { revalidate: 0 } });

        if (!res.ok) return { title: 'Not Found' };

        const data = await res.json();
        const content = JSON.parse(data.content);
        const title = data.title || 'Shared Brochure';
        const seo = data.seo_metadata;
        const ogImage = content.bespoke_image || data.owner_vault?.brand_logo_url || '/og-default.jpg';

        return {
            title: seo?.meta_title || title,
            description: seo?.meta_description || `View ${title} on BrochureGen.`,
            keywords: seo?.keywords?.join(', '),
            openGraph: {
                title: seo?.og_title || title,
                description: seo?.og_description || `Interactive 3D brochure for ${title}`,
                images: [{ url: ogImage }],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: seo?.og_title || title,
                description: seo?.og_description || `Interactive 3D brochure for ${title}`,
                images: [ogImage],
            }
        };
    } catch (error) {
        return { title: 'BrochureGen' };
    }
}

export default async function SharedBrochurePage({ params }: Props) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/v1/brochures/shared/${params.share_uuid}`, { next: { revalidate: 0 } });

    if (!res.ok) {
        if (res.status === 404) notFound();
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading brochure.</div>;
    }

    const data = await res.json();

    const formattedData: any = {
        title: data.title,
        url: data.url,
        is_campaign: data.is_campaign,
        ai_content: JSON.parse(data.content),
    };

    if (formattedData.ai_content?.bespoke_image) {
        formattedData.bespoke_image = formattedData.ai_content.bespoke_image;
    }

    const activeVault = data.owner_vault ? {
        primaryColor: data.owner_vault.brand_primary_color || '#4F46E5',
        secondaryColor: data.owner_vault.brand_secondary_color || '#EC4899',
        font: data.owner_vault.brand_font || 'Outfit',
        logoUrl: data.owner_vault.brand_logo_url
    } : null;

    return (
        <SharedViewClient
            shareUuid={params.share_uuid}
            data={formattedData}
            activeVault={activeVault}
            initialComments={data.comments || []}
        />
    );
}
