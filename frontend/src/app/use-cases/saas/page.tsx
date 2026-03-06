import UseCaseLanding from '@/components/UseCaseLanding';

export default function SaaSPage() {
    return (
        <UseCaseLanding
            industry="SaaS & Tech"
            title="Convert Developers into Paid Customers."
            description="Generate sleek API one-pagers, feature deep-dives, and technical one-sheets directly from your documentation or landing page."
            icon="🚀"
            benefits={["Dark Mode Compatible", "API Doc Sync", "Premium Tech Aesthetic"]}
            features={[
                {
                    title: "Automated Tech-Specs",
                    desc: "Our AI understands your SaaS architecture. It creates technical brochures that speak to CTOs and Lead Devs.",
                    icon: "💻"
                },
                {
                    title: "Product Showcases",
                    desc: "Extract UI components and dashboards into high-impact visual spreads that wow investors and prospects.",
                    icon: "✨"
                },
                {
                    title: "Feature Matrices",
                    desc: "Automatically generate comparison sheets and feature grids that clarify your pricing and upsell potential.",
                    icon: "📊"
                }
            ]}
        />
    );
}
