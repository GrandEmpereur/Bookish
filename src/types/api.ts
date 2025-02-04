export interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export interface ApiPaginatedResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: {
        items: T[];
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        }
    };
}

export interface ApiError {
    status: 'error';
    message: string;
    code?: string;
    details?: Record<string, any>;
} 