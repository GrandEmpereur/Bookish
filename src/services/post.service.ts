import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import {
  Post,
  PostSubject,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostResponse,
  GetPostsResponse,
  CreatePostResponse,
  UpdatePostResponse,
  ToggleLikeResponse,
  ToggleFavoriteResponse,
} from "@/types/postTypes";
import { CreatePostFormData } from "@/lib/validations/post";

class PostService {
  async getPosts(): Promise<GetPostsResponse> {
    return await apiRequest<GetPostsResponse>("GET", "/posts");
  }

  async getPost(id: string): Promise<GetPostResponse> {
    return await apiRequest<GetPostResponse>("GET", `/posts/${id}`);
  }

  async createPost(data: CreatePostFormData): Promise<GetPostResponse> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("content", data.content);

    if (data.media && data.media.length > 0) {
      data.media.forEach((file, index) => {
        formData.append("media", file);
      });
    }

    const result = await apiRequest<GetPostResponse>("POST", "/posts", {
      data: formData,
    });
    return result;
  }

  async updatePost(
    id: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<UpdatePostResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "media" && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`media[${index}]`, file);
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return await apiRequest<ApiResponse<UpdatePostResponse>>(
      "PATCH",
      `/posts/${id}`,
      { data: formData }
    );
  }

  async deletePost(id: string): Promise<void> {
    await apiRequest<void>("DELETE", `/posts/${id}`);
  }

  async toggleLike(id: string): Promise<ApiResponse<ToggleLikeResponse>> {
    return await apiRequest<ApiResponse<ToggleLikeResponse>>(
      "POST",
      `/posts/${id}/like`
    );
  }

  async toggleFavorite(
    id: string
  ): Promise<ApiResponse<ToggleFavoriteResponse>> {
    return await apiRequest<ApiResponse<ToggleFavoriteResponse>>(
      "POST",
      `/posts/${id}/favorite`
    );
  }

  async reportPost(id: string, reason: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>("POST", `/posts/${id}/report`, {
      data: { reason },
    });
  }
}

export const postService = new PostService();
