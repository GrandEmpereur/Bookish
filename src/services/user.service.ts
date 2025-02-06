import { CapacitorHttp } from '@capacitor/core';
import {
    GetAuthenticatedProfileResponse,
    GetUserProfileResponse,
    GetUserRelationsResponse,
    UpdateProfileResponse,
    UpdateProfilePictureResponse,
    CheckFriendshipStatusResponse,
    UpdateProfileRequest
} from '@/types/userTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class UserService {
    // GET /users/me
    async getAuthenticatedProfile(): Promise<GetAuthenticatedProfileResponse> {
        const response = await CapacitorHttp.get({
            url: `${API_URL}/users/me`,
            webFetchExtra: { credentials: 'include' }
        });
        console.log(response);

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la récupération du profil');
        }

        return response.data;
    }

    // GET /users/relations
    async getRelations(): Promise<GetUserRelationsResponse> {
        const response = await CapacitorHttp.get({
            url: `${API_URL}/users/relations`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la récupération des relations');
        }

        return response.data;
    }

    // PATCH /users/profile
    async updateProfile(data: Partial<UpdateProfileRequest>): Promise<UpdateProfileResponse> {
        const response = await CapacitorHttp.patch({
            url: `${API_URL}/users/profile`,
            data,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la mise à jour du profil');
        }

        return response.data;
    }

    // POST /users/avatar
    async updateProfilePicture(file: File): Promise<UpdateProfilePictureResponse> {
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
    }

    // DELETE /users/account
    async deleteAccount(): Promise<void> {
        const response = await CapacitorHttp.delete({
            url: `${API_URL}/users/account`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la suppression du compte');
        }
    }

    // GET /users/:userId
    async getUserProfile(userId: string): Promise<GetUserProfileResponse> {
        const response = await CapacitorHttp.get({
            url: `${API_URL}/users/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la récupération du profil');
        }

        return response.data;
    }

    // GET /users/:userId/friendship
    async checkFriendshipStatus(userId: string): Promise<CheckFriendshipStatusResponse> {
        const response = await CapacitorHttp.get({
            url: `${API_URL}/users/${userId}/friendship`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la vérification du statut');
        }

        return response.data;
    }

    // POST /users/block/:userId
    async blockUser(userId: string): Promise<void> {
        const response = await CapacitorHttp.post({
            url: `${API_URL}/users/block/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors du blocage');
        }
    }

    // DELETE /users/block/:userId
    async unblockUser(userId: string): Promise<void> {
        const response = await CapacitorHttp.delete({
            url: `${API_URL}/users/block/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors du déblocage');
        }
    }

    // POST /users/follow/:userId
    async followUser(userId: string): Promise<void> {
        const response = await CapacitorHttp.post({
            url: `${API_URL}/users/follow/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors du suivi');
        }
    }

    // DELETE /users/unfollow/:userId
    async unfollowUser(userId: string): Promise<void> {
        const response = await CapacitorHttp.delete({
            url: `${API_URL}/users/unfollow/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors du désabonnement');
        }
    }

    // POST /users/friend-request/:userId
    async sendFriendRequest(userId: string): Promise<void> {
        const response = await CapacitorHttp.post({
            url: `${API_URL}/users/friend-request/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de l\'envoi de la demande');
        }
    }

    // POST /users/friend-request/:userId/respond
    async respondToFriendRequest(userId: string, accept: boolean): Promise<void> {
        const response = await CapacitorHttp.post({
            url: `${API_URL}/users/friend-request/${userId}/respond`,
            data: { accept },
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la réponse à la demande');
        }
    }

    // DELETE /users/friend/:userId
    async removeFriend(userId: string): Promise<void> {
        const response = await CapacitorHttp.delete({
            url: `${API_URL}/users/friend/${userId}`,
            webFetchExtra: { credentials: 'include' }
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erreur lors de la suppression de l\'ami');
        }
    }
}

export const userService = new UserService(); 