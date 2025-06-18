import { apiRequest } from "@/lib/api-client";
import {
  GetCommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  ReplyCommentResponse,
} from "@/types/postTypes";

class CommentService {
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

  // GET /:postId/comments
  async getComments(postId: string): Promise<GetCommentsResponse> {
    return this.makeRequest<GetCommentsResponse>(
      "GET",
      `/posts/${postId}/comments`
    );
  }

  // POST /:postId/comments
  async createComment(
    postId: string,
    data: { content: string }
  ): Promise<CreateCommentResponse> {
    return this.makeRequest<CreateCommentResponse>(
      "POST",
      `/posts/${postId}/comments`,
      { data }
    );
  }

  // POST /:postId/comments/:commentId/reply
  async replyToComment(
    postId: string,
    commentId: string,
    data: { content: string }
  ): Promise<ReplyCommentResponse> {
    return this.makeRequest<ReplyCommentResponse>(
      "POST",
      `/posts/${postId}/comments/${commentId}/reply`,
      { data }
    );
  }

  // PUT /comments/:id
  async updateComment(
    commentId: string,
    data: { content: string }
  ): Promise<UpdateCommentResponse> {
    return this.makeRequest<UpdateCommentResponse>(
      "PUT",
      `/comments/${commentId}`,
      { data }
    );
  }

  // DELETE /comments/:id
  async deleteComment(
    commentId: string
  ): Promise<{
    status: string;
    message: string;
    data: { post: { id: string; commentsCount: number } };
  }> {
    return this.makeRequest<{
      status: string;
      message: string;
      data: { post: { id: string; commentsCount: number } };
    }>("DELETE", `/comments/${commentId}`);
  }
}

export const commentService = new CommentService();
