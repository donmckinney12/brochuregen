import { notFound } from 'next/navigation';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import Link from 'next/link';
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
        const res = await fetch(`${apiUrl}/api/v1/brochures/shared/${params.share_uuid}`, { next: { revalidate: 60 } });

        if (!res.ok) {
            return { title: 'Not Found' };
        }

        const data = await res.json();

        // Try to extract an image from ai_content if bespoke isn't at root
        let ogImage = '/og-default.jpg'; // We should probably fall back to a generic brand image
        try {
            const parsedContent = JSON.parse(data.content);
            if (parsedContent.bespoke_image) {
                ogImage = parsedContent.bespoke_image;
            } else if (data.owner_vault && data.owner_vault.brand_logo_url) {
                ogImage = data.owner_vault.brand_logo_url;
            }
        } catch (e) { }

        const title = data.title || 'Shared Brochure';
        const description = `View ${title} on BrochureGen.`;

        return {
            title: title,
            description: description,
            openGraph: {
                title: title,
                description: description,
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                images: [ogImage],
            },
        };
    } catch (error) {
        return {
            title: 'BrochureGen',
        };
    }
}

export default async function SharedBrochurePage({ params }: Props) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/v1/brochures/shared/${params.share_uuid}`, { next: { revalidate: 60 } });

    if (!res.ok) {
        if (res.status === 404) notFound();
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading brochure.</div>;
    }

    const data = await res.json();

    const formattedData: any = {
        title: data.title,
        url: data.url,
        ai_content: JSON.parse(data.content),
    };

    if (formattedData.ai_content && formattedData.ai_content.bespoke_image) {
        formattedData.bespoke_image = formattedData.ai_content.bespoke_image;
    }

    const activeVault = data.owner_vault ? {
        primaryColor: data.owner_vault.brand_primary_color || '#4F46E5',
        secondaryColor: data.owner_vault.brand_secondary_color || '#EC4899',
        font: brochure.vault.brand_font || 'Outfit',
        logoUrl: brochure.vault.brand_logo_url
    } : null;

    return (
        <div className="min-h-screen font-sans bg-[#020617] text-white flex flex-col relative overflow-hidden">
            {/* Minimal Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
                {activeVault?.logoUrl ? (
                    <img src={activeVault.logoUrl} alt="Brand Logo" className="h-8 object-contain drop-shadow-lg" />
                ) : (
                    <div className="font-bold tracking-tight text-xl drop-shadow-lg">
                        Brand Presentation
                    </div>
                )}
                <div className="pointer-events-auto">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        Create Your Own
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="w-full max-w-6xl px-4">
                    <ThreeDBrochure
                        data={brochure.data}
                        activeVault={activeVault}
                        onOpenRefiner={() => { }} // Disabled in view mode
                    />
                </div>
            </main>

            {/* Watermark / Footer */}
            <footer className="absolute bottom-6 w-full text-center z-50 pointer-events-none">
                <p className="text-xs font-medium text-slate-500 tracking-widest uppercase">
                    Powered by <span className="text-white font-bold">BrochureGen AI</span>
                </p>
            </footer>
        </div>
    );
}
