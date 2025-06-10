import { apiRequest } from "@/lib/api-client";
import {
  GetCommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  ReplyCommentResponse,
} from "@/types/postTypes";

class CommentService {
  // GET /:postId/comments
  async getComments(postId: string): Promise<GetCommentsResponse> {
    return await apiRequest<GetCommentsResponse>(
      "GET",
      `/posts/${postId}/comments`
    );
  }

  // POST /:postId/comments
  async createComment(
    postId: string,
    data: { content: string }
  ): Promise<CreateCommentResponse> {
    return await apiRequest<CreateCommentResponse>(
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
    return await apiRequest<ReplyCommentResponse>(
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
    return await apiRequest<UpdateCommentResponse>(
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
    return await apiRequest<{
      status: string;
      message: string;
      data: { post: { id: string; commentsCount: number } };
    }>("DELETE", `/comments/${commentId}`);
  }
}

export const commentService = new CommentService();
