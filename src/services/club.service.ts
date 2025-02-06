import { CapacitorHttp } from '@capacitor/core';
import {
    Club,
    ClubType,
    ClubMemberRole,
    CreateClubRequest,
    UpdateClubRequest,
    SendMessageRequest,
    JoinClubRequest,
    GetClubResponse,
    GetClubsResponse,
    CreateClubResponse,
    UpdateClubResponse,
    GetClubMessagesResponse,
    SendMessageResponse,
    GenerateInviteLinkResponse,
    JoinClubResponse
} from '@/types/clubTypes';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ClubService {
    async getClubs(options?: {
        page?: number;
        limit?: number;
        type?: ClubType;
        genre?: string;
        search?: string;
    }): Promise<ApiResponse<GetClubsResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());
            if (options?.type) queryParams.append('type', options.type);
            if (options?.genre) queryParams.append('genre', options.genre);
            if (options?.search) queryParams.append('search', options.search);

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

    async getClub(id: string): Promise<ApiResponse<GetClubResponse>> {
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

    async createClub(data: CreateClubRequest): Promise<ApiResponse<CreateClubResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'club_picture' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
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

    async updateClub(id: string, data: UpdateClubRequest): Promise<ApiResponse<UpdateClubResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'club_picture' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.patch({
                url: `${API_URL}/clubs/${id}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
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

    async deleteClub(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/clubs/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du club');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete club error:', error);
            throw error;
        }
    }

    async getMessages(clubId: string, page = 1): Promise<ApiResponse<GetClubMessagesResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/clubs/${clubId}/messages?page=${page}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des messages');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get messages error:', error);
            throw error;
        }
    }

    async sendMessage(clubId: string, data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
        try {
            const formData = new FormData();
            formData.append('content', data.content);
            if (data.media) {
                formData.append('media', data.media);
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

    async joinClub(id: string, data: JoinClubRequest): Promise<ApiResponse<JoinClubResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${id}/join`,
                headers: { 'Content-Type': 'application/json' },
                data,
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

    async leaveClub(id: string): Promise<ApiResponse<null>> {
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

    async generateInviteLink(clubId: string): Promise<ApiResponse<GenerateInviteLinkResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/invite`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la génération du lien');
            }

            return response.data;
        } catch (error: any) {
            console.error('Generate invite link error:', error);
            throw error;
        }
    }

    async banMember(clubId: string, userId: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/${clubId}/ban/${userId}`,
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

    async reportMessage(messageId: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/clubs/messages/${messageId}/report`,
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
}

export const clubService = new ClubService(); 