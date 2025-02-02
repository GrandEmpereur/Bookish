export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T;
}

export interface ApiError {
    status: 'error';
    message: string;
    code?: string;
    details?: Record<string, any>;
} 