import { apiRequest } from "@/lib/api-client";
import {
  AuthResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/authTypes";
import {
  GetAuthenticatedProfileResponse,
  GetUserProfileResponse,
  GetUserRelationsResponse,
  UpdateProfileResponse,
  UpdateProfilePictureResponse,
  CheckFriendshipStatusResponse,
  UpdateProfileRequest,
} from "@/types/userTypes";

class UserService {
  /**
   * Méthode utilitaire pour gérer les requêtes HTTP via le client centralisé
   */
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: { data?: unknown; params?: Record<string, any> }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  // Inscription (garde la méthode auth)
  async register(
    data: RegisterRequest
  ): Promise<AuthResponse<RegisterResponse>> {
    return this.makeRequest<AuthResponse<RegisterResponse>>(
      "POST",
      "/auth/register",
      { data }
    );
  }

  // GET /users/me
  async getAuthenticatedProfile(): Promise<GetAuthenticatedProfileResponse> {
    return this.makeRequest<GetAuthenticatedProfileResponse>(
      "GET",
      "/users/me"
    );
  }

  // GET /users/relations
  async getRelations(): Promise<GetUserRelationsResponse> {
    return this.makeRequest<GetUserRelationsResponse>(
      "GET",
      "/users/relations"
    );
  }

  // PATCH /users/profile
  async updateProfile(
    data: Partial<UpdateProfileRequest>
  ): Promise<UpdateProfileResponse> {
    return this.makeRequest<UpdateProfileResponse>("PATCH", "/users/profile", {
      data,
    });
  }

  // POST /users/avatar
  async updateProfilePicture(
    file: File
  ): Promise<UpdateProfilePictureResponse> {
    const formData = new FormData();
    formData.append("avatar", file);
    return this.makeRequest<UpdateProfilePictureResponse>(
      "POST",
      "/users/avatar",
      { data: formData }
    );
  }

  // DELETE /users/account
  async deleteAccount(): Promise<void> {
    await this.makeRequest<void>("DELETE", "/users/account");
  }

  // GET /users/:userId
  async getUserProfile(userId: string): Promise<GetUserProfileResponse> {
    return this.makeRequest<GetUserProfileResponse>("GET", `/users/${userId}`);
  }

  // GET /users/:userId/friendship
  async checkFriendshipStatus(
    userId: string
  ): Promise<CheckFriendshipStatusResponse> {
    return this.makeRequest<CheckFriendshipStatusResponse>(
      "GET",
      `/users/${userId}/friendship`
    );
  }

  // POST /users/block/:userId
  async blockUser(userId: string): Promise<void> {
    await this.makeRequest<void>("POST", `/users/block/${userId}`);
  }

  // DELETE /users/block/:userId
  async unblockUser(userId: string): Promise<void> {
    await this.makeRequest<void>("DELETE", `/users/block/${userId}`);
  }

  // POST /users/follow/:userId
  async followUser(userId: string): Promise<void> {
    await this.makeRequest<void>("POST", `/users/follow/${userId}`);
  }

  // DELETE /users/unfollow/:userId
  async unfollowUser(userId: string): Promise<void> {
    await this.makeRequest<void>("DELETE", `/users/unfollow/${userId}`);
  }

  // POST /users/friend-request/:userId
  async sendFriendRequest(userId: string): Promise<void> {
    await this.makeRequest<void>("POST", `/users/friend-request/${userId}`);
  }

  // POST /users/friend-request/:userId/respond
  async respondToFriendRequest(userId: string, accept: boolean): Promise<void> {
    const acceptValue = accept ? "accept" : "decline";
    await this.makeRequest<void>(
      "POST",
      `/users/friend-request/${userId}/respond`,
      { data: { accept: acceptValue } }
    );
  }

  // DELETE /users/friend/:userId
  async removeFriend(userId: string): Promise<void> {
    await this.makeRequest<void>("DELETE", `/users/friend/${userId}`);
  }
}

export const userService = new UserService();
