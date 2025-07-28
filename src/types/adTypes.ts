export interface Ad {
    id: string;
    title: string;
    mediaUrl: string;
    targetUrl: string;
    cpmPrice?: string;
    clicks?: number;
    impressions?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AdItem {
    type: "ad";
    ad: Ad;
} 