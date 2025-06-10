import { apiRequest } from "@/lib/api-client";
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
  // GET /users/me
  async getAuthenticatedProfile(): Promise<GetAuthenticatedProfileResponse> {
    try {
      return await apiRequest<GetAuthenticatedProfileResponse>(
        "GET",
        "/users/me"
      );
    } catch (error: any) {
      if (error.message?.includes("401")) {
        throw { status: 401 };
      }
      throw error;
    }
  }

  // GET /users/relations
  async getRelations(): Promise<GetUserRelationsResponse> {
    return await apiRequest<GetUserRelationsResponse>(
      "GET",
      "/users/relations"
    );
  }

  // PATCH /users/profile
  async updateProfile(
    data: Partial<UpdateProfileRequest>
  ): Promise<UpdateProfileResponse> {
    return await apiRequest<UpdateProfileResponse>("PATCH", "/users/profile", {
      data,
    });
  }

  // POST /users/avatar
  async updateProfilePicture(
    file: File
  ): Promise<UpdateProfilePictureResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    return await apiRequest<UpdateProfilePictureResponse>(
      "POST",
      "/users/avatar",
      {
        data: formData,
      }
    );
  }

  // DELETE /users/account
  async deleteAccount(): Promise<void> {
    await apiRequest<void>("DELETE", "/users/account");
  }

  // GET /users/:userId
  async getUserProfile(userId: string): Promise<GetUserProfileResponse> {
    return await apiRequest<GetUserProfileResponse>("GET", `/users/${userId}`);
  }

  // GET /users/:userId/friendship
  async checkFriendshipStatus(
    userId: string
  ): Promise<CheckFriendshipStatusResponse> {
    return await apiRequest<CheckFriendshipStatusResponse>(
      "GET",
      `/users/${userId}/friendship`
    );
  }

  // POST /users/block/:userId
  async blockUser(userId: string): Promise<void> {
    await apiRequest<void>("POST", `/users/block/${userId}`);
  }

  // DELETE /users/block/:userId
  async unblockUser(userId: string): Promise<void> {
    await apiRequest<void>("DELETE", `/users/block/${userId}`);
  }

  // POST /users/follow/:userId
  async followUser(userId: string): Promise<void> {
    await apiRequest<void>("POST", `/users/follow/${userId}`);
  }

  // DELETE /users/unfollow/:userId
  async unfollowUser(userId: string): Promise<void> {
    await apiRequest<void>("DELETE", `/users/unfollow/${userId}`);
  }

  // POST /users/friend-request/:userId
  async sendFriendRequest(userId: string): Promise<void> {
    await apiRequest<void>("POST", `/users/friend-request/${userId}`);
  }

  // POST /users/friend-request/:userId/respond
  async respondToFriendRequest(userId: string, accept: boolean): Promise<void> {
    await apiRequest<void>("POST", `/users/friend-request/${userId}/respond`, {
      data: { accept },
    });
  }

  // DELETE /users/friend/:userId
  async removeFriend(userId: string): Promise<void> {
    await apiRequest<void>("DELETE", `/users/friend/${userId}`);
  }
}

export const userService = new UserService();
