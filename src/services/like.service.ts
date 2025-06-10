import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { ToggleLikeResponse } from "@/types/postTypes";

class LikeService {
  async getLikedPosts(options?: {
    page?: number;
    limit?: number;
    sort?: "latest" | "oldest";
  }): Promise<
    ApiResponse<{
      likes: Array<{
        id: string;
        post_id: string;
        created_at: string;
        post: {
          id: string;
          title: string;
          content: string;
          user: {
            id: string;
            username: string;
            avatarUrl: string | null;
          };
        };
      }>;
      meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
    }>
  > {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.sort) params.sort = options.sort;

    return await apiRequest<
      ApiResponse<{
        likes: Array<{
          id: string;
          post_id: string;
          created_at: string;
          post: {
            id: string;
            title: string;
            content: string;
            user: {
              id: string;
              username: string;
              avatarUrl: string | null;
            };
          };
        }>;
        meta: {
          total: number;
          per_page: number;
          current_page: number;
          last_page: number;
        };
      }>
    >("GET", "/likes", { params });
  }

  async togglePostLike(postId: string): Promise<ToggleLikeResponse> {
    return await apiRequest<ToggleLikeResponse>("POST", "/like/post", {
      data: { postId },
    });
  }

  async toggleCommentLike(commentId: string): Promise<ToggleLikeResponse> {
    return await apiRequest<ToggleLikeResponse>("POST", "/like/comment", {
      data: { commentId },
    });
  }

  async checkIsLiked(
    type: "post" | "comment",
    id: string
  ): Promise<ApiResponse<{ is_liked: boolean }>> {
    return await apiRequest<ApiResponse<{ is_liked: boolean }>>(
      "GET",
      `/${type}s/${id}/like/check`
    );
  }

  async getLikesByType(
    type: "posts" | "comments",
    options?: {
      page?: number;
      limit?: number;
    }
  ): Promise<
    ApiResponse<{
      likes: Array<{
        id: string;
        type_id: string;
        created_at: string;
      }>;
      meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
    }>
  > {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;

    return await apiRequest<
      ApiResponse<{
        likes: Array<{
          id: string;
          type_id: string;
          created_at: string;
        }>;
        meta: {
          total: number;
          per_page: number;
          current_page: number;
          last_page: number;
        };
      }>
    >("GET", `/likes/type/${type}`, { params });
  }
}

export const likeService = new LikeService();
