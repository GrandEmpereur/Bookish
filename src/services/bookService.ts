import { apiClient, handleApiError } from './apiClient';
import { Book } from '@/types/book';

export const searchBooks = async (): Promise<Book[]> => {
    try {
        const response = await apiClient.get(`/books`);
        console.log("books récupérés:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return [];
    }
};