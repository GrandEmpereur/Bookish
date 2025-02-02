import { CapacitorHttp } from '@capacitor/core';
import { User, UserRelations, FriendshipStatus } from '@/types/user';
import { UpdateProfileInput } from '@/lib/validations/user';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class UserService {
    // Récupérer le profil de l'utilisateur authentifié
    async getProfile(): Promise<ApiResponse<User>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/users/me`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du profil');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    // Récupérer les relations de l'utilisateur
    async getRelations(): Promise<ApiResponse<UserRelations>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/users/relations`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des relations');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get relations error:', error);
            throw error;
        }
    }

    // Mettre à jour le profil
    async updateProfile(data: UpdateProfileInput): Promise<ApiResponse<User>> {
        try {
            const response = await CapacitorHttp.patch({
                url: `${API_URL}/users/profile`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du profil');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    // Mettre à jour l'avatar
    async updateAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await CapacitorHttp.post({
                url: `${API_URL}/users/avatar`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour de l\'avatar');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update avatar error:', error);
            throw error;
        }
    }

    // Supprimer le compte
    async deleteAccount(): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/users/account`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du compte');
            }
        } catch (error: any) {
            console.error('Delete account error:', error);
            throw error;
        }
    }

    // Récupérer un profil utilisateur par ID
    async getUserProfile(userId: string): Promise<ApiResponse<User>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/users/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du profil');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get user profile error:', error);
            throw error;
        }
    }

    // Vérifier le statut d'amitié
    async checkFriendshipStatus(userId: string): Promise<ApiResponse<FriendshipStatus>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/users/${userId}/friendship`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification du statut');
            }

            return response.data;
        } catch (error: any) {
            console.error('Check friendship status error:', error);
            throw error;
        }
    }

    // Bloquer un utilisateur
    async blockUser(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/users/block/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du blocage');
            }

            return response.data;
        } catch (error: any) {
            console.error('Block user error:', error);
            throw error;
        }
    }

    // Débloquer un utilisateur
    async unblockUser(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/users/block/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du déblocage');
            }

            return response.data;
        } catch (error: any) {
            console.error('Unblock user error:', error);
            throw error;
        }
    }

    // Suivre un utilisateur
    async followUser(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/users/follow/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'abonnement');
            }

            return response.data;
        } catch (error: any) {
            console.error('Follow user error:', error);
            throw error;
        }
    }

    // Ne plus suivre un utilisateur
    async unfollowUser(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/users/unfollow/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du désabonnement');
            }

            return response.data;
        } catch (error: any) {
            console.error('Unfollow user error:', error);
            throw error;
        }
    }

    // Envoyer une demande d'ami
    async sendFriendRequest(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/users/friend-request/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de l\'envoi de la demande');
            }

            return response.data;
        } catch (error: any) {
            console.error('Send friend request error:', error);
            throw error;
        }
    }

    // Répondre à une demande d'ami
    async respondToFriendRequest(userId: string, status: 'accepted' | 'rejected'): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/users/friend-request/${userId}/respond`,
                headers: { 'Content-Type': 'application/json' },
                data: { status },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la réponse à la demande');
            }

            return response.data;
        } catch (error: any) {
            console.error('Respond to friend request error:', error);
            throw error;
        }
    }

    // Supprimer un ami
    async removeFriend(userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/users/friend/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de l\'ami');
            }

            return response.data;
        } catch (error: any) {
            console.error('Remove friend error:', error);
            throw error;
        }
    }
}

export const userService = new UserService(); 