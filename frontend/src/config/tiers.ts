export type Plan = 'free' | 'pro' | 'agency' | 'enterprise';

export interface TierMetadata {
    name: string;
    label: string;
    description: string;
    color: string;
    dotColor: string;
    features: string[];
}

export const PLAN_METADATA: Record<Plan, TierMetadata> = {
    free: {
        name: 'Free',
        label: 'SYSTEM BANDWIDTH',
        description: 'Basic synthesis for individual creators.',
        color: 'slate',
        dotColor: 'bg-slate-500',
        features: ['10 Brochure Generations', 'Standard Themes', 'Basic SEO Meta']
    },
    pro: {
        name: 'Starter',
        label: 'PRO NODE',
        description: 'Enhanced output for growing brands.',
        color: 'indigo',
        dotColor: 'bg-indigo-500',
        features: ['50 Brochure Generations', 'Lead Management Basic', 'SEO Meta Optimization', 'Professional Themes', 'High-Res Export']
    },
    agency: {
        name: 'Professional',
        label: 'AGENCY MATRIX',
        description: 'Full studio capabilities for teams.',
        color: 'blue',
        dotColor: 'bg-blue-500',
        features: ['150 Brochure Generations', 'Analytics Dashboard', 'A/B Testing Integration', 'Team Collaboration', 'Precision Content Refiner']
    },
    enterprise: {
        name: 'Enterprise',
        label: 'ZENITH CORE',
        description: 'Unlimited power for global operations.',
        color: 'cyan',
        dotColor: 'bg-cyan-500',
        features: ['300+ Brochure Generations', 'Automated Follow-ups', 'Unlimited Team Members', 'Advanced Reporting', 'Brand Asset Management', 'White-Label Branding']
    }
};

export const FEATURE_GATES = {
    ANALYTICS: ['agency', 'enterprise'],
    LEADS: ['pro', 'agency', 'enterprise'],
    FEEDBACK: ['agency', 'enterprise'],
    TEAM: ['enterprise'],
    BRAND_VAULT_ADVANCED: ['agency', 'enterprise']
};

export function hasFeature(plan: Plan | null | undefined, feature: keyof typeof FEATURE_GATES): boolean {
    if (!plan) return false;
    const allowedPlans = FEATURE_GATES[feature];
    return (allowedPlans as string[]).includes(plan);
}
