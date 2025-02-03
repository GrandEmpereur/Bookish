'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Heart } from "lucide-react";
import { commentService } from "@/services/comment.service";
import { likeService } from "@/services/like.service";
import { Comment } from "@/types/comment";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadComments();
        // Charger les likes depuis le sessionStorage
        const savedLikes = sessionStorage.getItem('likedComments');
        if (savedLikes) setLikedComments(new Set(JSON.parse(savedLikes)));
    }, [postId]);

    const loadComments = async () => {
        try {
            setIsLoading(true);
            const response = await commentService.getComments(postId);
            setComments(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les commentaires"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            if (replyingTo) {
                await commentService.replyToComment(postId, replyingTo.commentId, {
                    content: newComment,
                    spoilerAlert: false
                });
            } else {
                await commentService.createComment(postId, {
                    content: newComment,
                    spoilerAlert: false
                });
            }
            
            setNewComment('');
            setReplyingTo(null);
            await loadComments();
            
            toast({
                title: "Succès",
                description: replyingTo ? "Réponse ajoutée" : "Commentaire ajouté"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'ajouter le commentaire"
            });
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            const response = await likeService.toggleCommentLike({ commentId });
            
            if (response.status === 'success') {
                const newLikedComments = new Set(likedComments);
                const isLiked = response.message === 'Comment liked successfully';

                if (isLiked) {
                    newLikedComments.add(commentId);
                } else {
                    newLikedComments.delete(commentId);
                }

                setLikedComments(newLikedComments);
                sessionStorage.setItem('likedComments', JSON.stringify([...newLikedComments]));

                // Mise à jour du compteur avec la bonne structure de réponse
                const updatedComment = comments.map(comment => 
                    comment.id === commentId ? { ...comment, likesCount: comment.likesCount + (isLiked ? 1 : -1) } : comment
                );
                setComments(updatedComment);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de liker le commentaire"
            });
        }
    };

    const handleReply = (commentId: string, username: string) => {
        setReplyingTo({ commentId, username });
        // Focus sur la zone de texte
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.focus();
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
                            Réponse à <span className="font-medium">{replyingTo.username}</span>
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
                    placeholder={replyingTo ? `Répondre à ${replyingTo.username}...` : "Écrivez un commentaire..."}
                    className="resize-none min-h-[100px]"
                />
                <div className="flex justify-end">
                    <Button 
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        size="sm"
                    >
                        {replyingTo ? 'Répondre' : 'Commenter'}
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
                                            {formatDistanceToNow(new Date(comment.createdAt), {
                                                addSuffix: true,
                                                locale: fr
                                            })}
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
                                            likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"
                                        )}
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        <Heart 
                                            className="h-4 w-4 mr-1"
                                            fill={likedComments.has(comment.id) ? "currentColor" : "none"}
                                            stroke="currentColor"
                                        />
                                        <span className="text-xs">{comment.likesCount}</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-muted-foreground hover:text-primary text-xs"
                                        onClick={() => handleReply(comment.id, comment.user.username)}
                                    >
                                        Reply
                                    </Button>
                                </div>
                                
                                {/* Affichage des réponses */}
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
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">
                                                            {reply.user.username}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(reply.createdAt), {
                                                                addSuffix: true,
                                                                locale: fr
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-1">{reply.content}</p>
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