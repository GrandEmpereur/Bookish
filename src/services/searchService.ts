// services/searchServices.ts
import { apiClient, handleApiError } from './apiClient';
import { User } from '@/types/user';

export const searchUsers = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get(`/search/users`);
        console.log("Utilisateurs récupérés:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return [];
    }
};

