import UseCaseLanding from '@/components/UseCaseLanding';

export default function EducationPage() {
    return (
        <UseCaseLanding
            industry="Education"
            title="Modern Brochures for Modern Learning."
            description="Create enrollment guides, course catalogs, and campus brochures in an instant. Attract students with high-quality, professional collateral."
            icon="🎓"
            benefits={["Enrollment Boosters", "Course Highlights", "Accessible Design"]}
            features={[
                {
                    title: "Course Catalog Import",
                    desc: "Turn your LMS or course directory into a beautiful, printable PDF guide for prospective students.",
                    icon: "📚"
                },
                {
                    title: "Alumni Success Focus",
                    desc: "Our AI highlights alumni success stories and stats from your site to build social proof and trust.",
                    icon: "🌟"
                },
                {
                    title: "Event Flyers",
                    desc: "Generate professional event collateral for campus tours, orientations, and seminar series in the click of a button.",
                    icon: "🎟️"
                }
            ]}
        />
    );
}
