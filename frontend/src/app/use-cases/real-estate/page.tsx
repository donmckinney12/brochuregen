import UseCaseLanding from '@/components/UseCaseLanding';

export default function RealEstatePage() {
    return (
        <UseCaseLanding
            industry="Real Estate"
            title="Professional Property Brochures in Seconds."
            description="Transform your listing pages into stunning, high-converting 3-fold brochures. Perfect for open houses, mailers, and premium property presentations."
            icon="🏠"
            benefits={["MLS Sync Ready", "High-Res Exports", "Agent Branding"]}
            features={[
                {
                    title: "MLS to Brochure",
                    desc: "Simply paste your listing URL. Our AI extracts photos, amenities, and property descriptions automatically.",
                    icon: "⚡"
                },
                {
                    title: "Brand Accuracy",
                    desc: "Upload your brokerage logo and colors. Every brochure generated stays perfectly on-brand for your office.",
                    icon: "🎨"
                },
                {
                    title: "Floorplan Support",
                    desc: "Our AI intelligently identifies floorplans and places them prominently in the layout for maximum impact.",
                    icon: "📐"
                }
            ]}
        />
    );
}
