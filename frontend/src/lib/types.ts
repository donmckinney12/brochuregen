export interface BrochureData {
    id: number;
    title: string;
    content: string;
    [key: string]: unknown;
}

export interface LeadData {
    id: number;
    type: string;
    metadata: {
        is_read: boolean;
        [key: string]: unknown;
    };
}

export interface FeedbackData {
    id: number;
    text: string;
    section_id: string;
    created_at: string;
    brochure?: BrochureData;
}

export interface TemplateData {
    id: string;
    name: string;
    category: string;
    layout?: string;
}

export interface ApiKeyData {
    id: number;
    name: string;
    key: string;
    created_at: string;
}
