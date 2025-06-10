import { apiRequest } from "@/lib/api-client";
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
    const res = await fetch(`${API_URL}/users/me`, {
      credentials: 'include',
    });

    if (res.status === 401) {
      throw { status: 401 };
    }

    const data = (await res.json()) as GetAuthenticatedProfileResponse;

    if (!res.ok) {
      throw new Error((data as any)?.message || 'Erreur lors de la récupération du profil');
    }

    return data;
  }

  // GET /users/relations
  async getRelations(): Promise<GetUserRelationsResponse> {
    const res = await fetch(`${API_URL}/users/relations`, { credentials: 'include' });

    const data = (await res.json()) as GetUserRelationsResponse;

    if (!res.ok) {
      throw new Error((data as any)?.message || 'Erreur lors de la récupération des relations');
    }

    return data;
  }

  // PATCH /users/profile
  async updateProfile(data: Partial<UpdateProfileRequest>): Promise<UpdateProfileResponse> {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const resData = (await res.json()) as UpdateProfileResponse;

    if (!res.ok) {
      throw new Error((resData as any)?.message || 'Erreur lors de la mise à jour du profil');
    }

    return resData;
  }

  // POST /users/avatar
  async updateProfilePicture(
    file: File
  ): Promise<UpdateProfilePictureResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_URL}/users/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = (await res.json()) as UpdateProfilePictureResponse;

    if (!res.ok) {
      throw new Error((data as any)?.message || 'Erreur lors de la mise à jour de l\'avatar');
    }

    return data;
  }

  // DELETE /users/account
  async deleteAccount(): Promise<void> {
    const res = await fetch(`${API_URL}/users/account`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || 'Erreur lors de la suppression du compte');
    }
  }

  // GET /users/:userId
  async getUserProfile(userId: string): Promise<GetUserProfileResponse> {
    const res = await fetch(`${API_URL}/users/${userId}`, { credentials: 'include' });

    const data = (await res.json()) as GetUserProfileResponse;

    if (!res.ok) {
      throw new Error((data as any)?.message || 'Erreur lors de la récupération du profil');
    }

    return data;
  }

  // GET /users/:userId/friendship
  async checkFriendshipStatus(userId: string): Promise<CheckFriendshipStatusResponse> {
    const res = await fetch(`${API_URL}/users/${userId}/friendship`, { credentials: 'include' });

    const data = (await res.json()) as CheckFriendshipStatusResponse;

    if (!res.ok) {
      throw new Error((data as any)?.message || 'Erreur lors de la vérification du statut');
    }

    return data;
  }

  // POST /users/block/:userId
  async blockUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/block/${userId}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Erreur lors du blocage');
    }
  }

  // DELETE /users/block/:userId
  async unblockUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/block/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Erreur lors du déblocage');
    }
  }

  // POST /users/follow/:userId
  async followUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/follow/${userId}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Erreur lors du suivi');
    }
  }

  // DELETE /users/unfollow/:userId
  async unfollowUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/unfollow/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Erreur lors du désabonnement');
    }
  }

  // POST /users/friend-request/:userId
  async sendFriendRequest(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/friend-request/${userId}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Erreur lors de l'envoi de la demande");
    }
  }

  // POST /users/friend-request/:userId/respond
  async respondToFriendRequest(userId: string, accept: boolean): Promise<void> {
    const response = await fetch(`${API_URL}/users/friend-request/${userId}/respond`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accept })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Erreur lors de la réponse à la demande');
    }
  }

  // DELETE /users/friend/:userId
  async removeFriend(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/friend/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Erreur lors de la suppression de l'ami");
    }
  }
}

export const userService = new UserService();
