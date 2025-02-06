import { apiClient, handleApiError } from './apiClient';

export const getLists = async (): Promise<{}> => {
    try {
        const response = await apiClient.get<{}>('/book-lists');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
    ;
};

export const getListById = async (listId: string): Promise<{}> => {
    try {
        const response = await apiClient.get<{}>(`/book-lists/${listId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};

