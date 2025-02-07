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

export const createList = async (formData: FormData): Promise<{}> => {
    try {
        const response = await apiClient.post<{}>('/book-lists', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};


export const updateList = async (id: string, listData: Partial<{}>): Promise<{}> => {
    try {
        const response = await apiClient.put<{}>(`/book-lists/${id}`, listData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};


export const deleteList = async (listId: string): Promise<{}> => {
    try {
        const response = await apiClient.delete<{}>(`/book-lists/${listId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};
