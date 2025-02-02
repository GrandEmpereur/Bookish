import { CapacitorHttp } from '@capacitor/core';
import {
    Club,
    ClubFilters,
    PaginatedClubs,
    ClubPost,
    ClubMessage
} from '@/types/club';
import {
    CreateClubInput,
    UpdateClubInput,
    BanMemberInput,
    CreateClubPostInput,
    SendClubMessageInput,
    ReportMessageInput
} from '@/lib/validations/club';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ClubService {
    // Récupérer la liste des clubs
    async getClubs(filters: ClubFilters = {}): Promise<ApiResponse<PaginatedClubs>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.type && { type: filters.type }),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/clubs?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des clubs');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get clubs error:', error);
            throw error;
        }
    }

    // Créer un club
    async createClub(data: CreateClubInput): Promise<ApiResponse<Club>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du club');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create club error:', error);
            throw error;
        }
    }

    // Récupérer les détails d'un club
    async getClub(id: string): Promise<ApiResponse<Club>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/clubs/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du club');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get club error:', error);
            throw error;
        }
    }

    // Mettre à jour un club
    async updateClub(id: string, data: UpdateClubInput): Promise<ApiResponse<Club>> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/clubs/${id}`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du club');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update club error:', error);
            throw error;
        }
    }

    // Rejoindre un club
    async joinClub(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${id}/join`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la demande d\'adhésion');
            }

            return response.data;
        } catch (error: any) {
            console.error('Join club error:', error);
            throw error;
        }
    }

    // Quitter un club
    async leaveClub(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${id}/leave`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du départ du club');
            }

            return response.data;
        } catch (error: any) {
            console.error('Leave club error:', error);
            throw error;
        }
    }

    // Bannir un membre
    async banMember(clubId: string, data: BanMemberInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/ban`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du bannissement');
            }

            return response.data;
        } catch (error: any) {
            console.error('Ban member error:', error);
            throw error;
        }
    }

    // Créer un post
    async createPost(clubId: string, data: CreateClubPostInput): Promise<ApiResponse<ClubPost>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/posts`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create post error:', error);
            throw error;
        }
    }

    // Supprimer un post
    async deletePost(clubId: string, postId: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/clubs/${clubId}/posts/${postId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du post');
            }
        } catch (error: any) {
            console.error('Delete post error:', error);
            throw error;
        }
    }

    // Envoyer un message
    async sendMessage(clubId: string, data: SendClubMessageInput): Promise<ApiResponse<ClubMessage>> {
        try {
            const formData = new FormData();
            formData.append('content', data.content);

            if (data.attachments) {
                data.attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });
            }

            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/messages`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de l\'envoi du message');
            }

            return response.data;
        } catch (error: any) {
            console.error('Send message error:', error);
            throw error;
        }
    }

    // Signaler un message
    async reportMessage(
        clubId: string,
        messageId: string,
        data: ReportMessageInput
    ): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/messages/${messageId}/report`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du signalement');
            }

            return response.data;
        } catch (error: any) {
            console.error('Report message error:', error);
            throw error;
        }
    }

    // Générer un lien d'invitation
    async getInviteLink(clubId: string): Promise<ApiResponse<{ code: string }>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/clubs/${clubId}/invite`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la génération du lien');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get invite link error:', error);
            throw error;
        }
    }

    // Rejoindre avec un code d'invitation
    async joinWithInvite(code: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/join-with-invite`,
                headers: { 'Content-Type': 'application/json' },
                data: { code },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Code d\'invitation invalide');
            }

            return response.data;
        } catch (error: any) {
            console.error('Join with invite error:', error);
            throw error;
        }
    }
}

export const clubService = new ClubService(); 