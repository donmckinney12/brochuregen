import { notFound } from 'next/navigation';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import { API_URL } from '@/config';

type Props = {
    params: { share_uuid: string }
};

export default async function EmbedBrochurePage({ params }: Props) {
    const res = await fetch(`${API_URL}/api/v1/brochures/shared/${params.share_uuid}`, { next: { revalidate: 0 } });

    if (!res.ok) {
        return <div className="flex items-center justify-center h-screen text-xs text-white/20 uppercase tracking-widest bg-transparent">Neural Sync Error</div>;
    }

    const data = await res.json();

    const formattedData: any = {
        title: data.title,
        url: data.url,
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
        <div className="h-screen w-full bg-transparent overflow-hidden flex items-center justify-center p-4">
            <style dangerouslySetInnerHTML={{
                __html: `
                body { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }
            `}} />
            <div className="w-full h-full max-w-4xl flex items-center justify-center">
                <ThreeDBrochure
                    data={formattedData}
                    activeVault={activeVault}
                    onOpenRefiner={() => { }}
                />
            </div>
        </div>
    );
}
