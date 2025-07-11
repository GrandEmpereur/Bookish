"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { safeFormatDistanceToNow } from "@/lib/date";
import { Loader2, Heart } from "lucide-react";
import { commentService } from "@/services/comment.service";
import { likeService } from "@/services/like.service";
import { Comment } from "@/types/postTypes";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommentsProps {
  postId: string;
}

interface ReplyingTo {
  commentId: string;
  username: string;
}

export function CommentsSection({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);

  useEffect(() => {
    loadComments();
    // Charger les likes depuis le sessionStorage
    const savedLikes = sessionStorage.getItem("likedComments");
    if (savedLikes) setLikedComments(new Set(JSON.parse(savedLikes)));
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentService.getComments(postId);

      // S'assurer que chaque commentaire et réponse a un likesCount valide
      const formattedComments = response.data.map((comment) => ({
        ...comment,
        likesCount: comment.likesCount || 0,
        replies: comment.replies?.map((reply) => ({
          ...reply,
          likesCount: reply.likesCount || 0,
        })),
      }));

      // Trier les commentaires par nombre de likes
      const sortedComments = [...formattedComments].sort(
        (a, b) => b.likesCount - a.likesCount
      );

      setComments(sortedComments);
    } catch (error) {
      toast.error("Impossible de charger les commentaires");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      if (replyingTo) {
        // Trouver le commentaire parent original (le commentaire de premier niveau)
        const parentComment = comments.find(
          (comment) =>
            comment.id === replyingTo.commentId ||
            comment.replies?.some((reply) => reply.id === replyingTo.commentId)
        );

        if (parentComment) {
          // Si on répond à une réponse, utiliser l'ID du commentaire parent
          const commentIdToReplyTo = parentComment.id;

          await commentService.replyToComment(postId, commentIdToReplyTo, {
            content: newComment,
          });
        }
      } else {
        await commentService.createComment(postId, {
          content: newComment,
        });
      }

      setNewComment("");
      setReplyingTo(null);
      await loadComments();

      toast.success(replyingTo ? "Réponse ajoutée" : "Commentaire ajouté");
    } catch (error) {
      toast.error("Impossible d'ajouter le commentaire");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      // Optimistic update - Mettre à jour l'UI immédiatement
      const newLikedComments = new Set(likedComments);
      const isCurrentlyLiked = likedComments.has(commentId);

      if (isCurrentlyLiked) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }

      setLikedComments(newLikedComments);
      sessionStorage.setItem(
        "likedComments",
        JSON.stringify([...newLikedComments])
      );

      // Mise à jour optimiste du compteur
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likesCount: comment.likesCount + (isCurrentlyLiked ? -1 : 1),
          };
        }
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likesCount: reply.likesCount + (isCurrentlyLiked ? -1 : 1),
                }
              : reply
          );
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
      setComments(updatedComments);

      // Faire la requête API en arrière-plan
      const response = await likeService.toggleCommentLike(commentId);

      if (response.status !== "success") {
        // En cas d'erreur, revenir à l'état précédent
        const revertLikedComments = new Set(likedComments);
        if (isCurrentlyLiked) {
          revertLikedComments.add(commentId);
        } else {
          revertLikedComments.delete(commentId);
        }
        setLikedComments(revertLikedComments);
        sessionStorage.setItem(
          "likedComments",
          JSON.stringify([...revertLikedComments])
        );

        // Revenir au compteur précédent
        const revertedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, likesCount: response.data.likesCount };
          }
          if (comment.replies) {
            const revertedReplies = comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, likesCount: response.data.likesCount }
                : reply
            );
            return { ...comment, replies: revertedReplies };
          }
          return comment;
        });
        setComments(revertedComments);

        throw new Error("Erreur lors du like");
      }
    } catch (error) {
      toast.error("Impossible de liker le commentaire");
    }
  };

  const handleReply = (commentId: string, username: string) => {
    // Trouver le commentaire parent si on répond à une réponse
    const parentComment = comments.find(
      (comment) =>
        comment.id === commentId ||
        comment.replies?.some((reply) => reply.id === commentId)
    );

    if (parentComment) {
      setReplyingTo({
        commentId: parentComment.id, // Toujours utiliser l'ID du commentaire parent
        username: username,
      });
      // Focus sur la zone de texte
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-5">
      {/* Zone de saisie du commentaire */}
      <div className="space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between bg-accent/50 p-2 rounded-md">
            <p className="text-sm">
              Réponse à{" "}
              <span className="font-medium">{replyingTo.username}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelReply}
              className="h-auto py-1 px-2 hover:bg-accent"
            >
              Annuler
            </Button>
          </div>
        )}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            replyingTo
              ? `Répondre à ${replyingTo.username}...`
              : "Écrivez un commentaire..."
          }
          className="resize-none min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            size="sm"
          >
            {replyingTo ? "Répondre" : "Commenter"}
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <h3 className="text-lg font-bold text-center mb-6">Commentaires</h3>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id}>
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {comment.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {safeFormatDistanceToNow(comment.createdAt, true)}
                    </span>
                  </div>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto p-0 hover:text-primary",
                      likedComments.has(comment.id)
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => handleLike(comment.id)}
                  >
                    <Heart
                      className="h-4 w-4 mr-1"
                      fill={
                        likedComments.has(comment.id) ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                    />
                    <span className="text-xs">{comment.likesCount}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-primary text-xs"
                    onClick={() =>
                      handleReply(comment.id, comment.user.username)
                    }
                  >
                    Reply
                  </Button>
                </div>

                {/* Affichage des réponses avec likes et reply */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>
                            {reply.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {reply.user.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {safeFormatDistanceToNow(reply.createdAt, true)}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              en réponse à @{comment.user.username}
                            </span>
                          </div>
                          <p className="text-sm mt-2">{reply.content}</p>
                          {/* Ajout des boutons like et reply pour les réponses */}
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-auto p-0 hover:text-primary",
                                likedComments.has(reply.id)
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                              onClick={() => handleLike(reply.id)}
                            >
                              <Heart
                                className="h-4 w-4 mr-1"
                                fill={
                                  likedComments.has(reply.id)
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke="currentColor"
                              />
                              <span className="text-xs">
                                {typeof reply.likesCount === "number"
                                  ? reply.likesCount
                                  : 0}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-primary text-xs"
                              onClick={() =>
                                handleReply(reply.id, reply.user.username)
                              }
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
