'use client';

import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { postService } from "@/services/post.service";
import { Heart, MessageCircle, Bookmark, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Share } from '@capacitor/share';
import { likeService } from "@/services/like.service";
import { favoriteService } from "@/services/favorite.service";
import { cn } from "@/lib/utils";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const response = await postService.getPosts();
            setPosts(response.data || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les posts"
            });
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            // Mise à jour optimiste de l'UI
            setPosts(currentPosts => 
                currentPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            isLiked: !post.isLiked,
                            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
                        };
                    }
                    return post;
                })
            );

            // Appel à l'API
            const response = await likeService.togglePostLike(postId);

            // Mise à jour avec la réponse réelle de l'API
            setPosts(currentPosts => 
                currentPosts.map(post => {
                    if (post.id === postId) {
                        // Vérification plus précise de l'état liked/unliked
                        const isNowLiked = response.message === 'Post liked successfully';
                        const newLikesCount = isNowLiked 
                            ? (response.data as any).post?.likesCount 
                            : (response.data as any).likesCount;

                        return {
                            ...post,
                            isLiked: isNowLiked,
                            likesCount: newLikesCount !== undefined ? newLikesCount : post.likesCount
                        };
                    }
                    return post;
                })
            );
        } catch (error: any) {
            // En cas d'erreur, on revient à l'état précédent
            setPosts(currentPosts => 
                currentPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            isLiked: !post.isLiked,
                            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
                        };
                    }
                    return post;
                })
            );

            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de liker ce post"
            });
        }
    };

    const handleComment = (postId: string) => {
        router.push(`/feed/${postId}/`);
    };

    const handleBookmark = async (postId: string) => {
        try {
            // Récupérer le post actuel
            const currentPost = posts.find(p => p.id === postId);
            const newFavoriteState = !currentPost?.isFavorite;

            // Mise à jour optimiste de l'UI
            setPosts(currentPosts => 
                currentPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            isFavorite: newFavoriteState
                        };
                    }
                    return post;
                })
            );

            // Appel à l'API
            const response = await favoriteService.toggleFavorite(postId);

            // Vérifier si l'action a réussi
            const isSuccess = response.status === 'success';
            const isAddedToFavorites = response.message === 'Added to favorites';

            if (!isSuccess) {
                // Si l'action a échoué, revenir à l'état précédent
                setPosts(currentPosts => 
                    currentPosts.map(post => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                isFavorite: !newFavoriteState
                            };
                        }
                        return post;
                    })
                );
                throw new Error(response.message);
            }

            // Maintenir l'état optimiste si l'action a réussi
            // Pas besoin de mettre à jour l'état car il correspond déjà à la réponse

            // Afficher le toast de confirmation
            toast({
                title: isAddedToFavorites ? "Ajouté aux favoris" : "Retiré des favoris",
                description: isAddedToFavorites 
                    ? "Le post a été ajouté à vos favoris" 
                    : "Le post a été retiré de vos favoris"
            });

        } catch (error: any) {
            console.error('Bookmark error:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de modifier les favoris"
            });
        }
    };

    const handleShare = async (post: Post) => {
        try {
            const shareOptions = {
                title: post.title,
                text: post.content,
                url: `${window.location.origin}/posts/${post.id}`,
                dialogTitle: 'Partager ce post',
                ...(post.media && post.media.length > 0 && {
                    files: [post.media[0].url]
                })
            };

            await Share.share(shareOptions);
        } catch (error) {
            console.error('Share error:', error);
            toast({
                title: "Erreur",
                description: "Impossible de partager ce post"
            });
        }
    };

    const handleCreatePost = () => {
        router.push('/posts/create');
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 px-5 pb-[20px] pt-[100px]">
                <div className="max-w-md mx-auto space-y-6">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <article 
                                key={post.id} 
                                className="bg-card rounded-lg p-4 shadow-sm space-y-4"
                            >
                                <div className="flex gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {post.user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                {post.user.username}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(post.createdAt), { 
                                                    addSuffix: false,
                                                    locale: fr 
                                                })}
                                            </span>
                                        </div>
                                        <h2 className="text-sm text-muted-foreground mt-0.5">
                                            {post.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    {post.content}
                                </div>

                                {post.media && post.media.length > 0 && (
                                    <div className="flex flex-col">
                                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                            <Image
                                                src={post.media[0].url}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-6">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "text-muted-foreground hover:text-primary flex items-center gap-1.5",
                                            post.isLiked && "text-primary"
                                        )}
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <Heart 
                                            className="h-5 w-5" 
                                            fill={post.isLiked ? "currentColor" : "none"} 
                                            strokeWidth={2}
                                        />
                                        <span className="text-sm">
                                            {post.likesCount >= 0 ? post.likesCount : 0}
                                        </span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-primary flex items-center gap-1.5"
                                        onClick={() => handleComment(post.id)}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        <span className="text-sm">{post.commentsCount}</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "text-muted-foreground hover:text-primary",
                                            post.isFavorite && "text-primary"
                                        )}
                                        onClick={() => handleBookmark(post.id)}
                                    >
                                        <Bookmark 
                                            className="h-5 w-5" 
                                            fill={post.isFavorite ? "currentColor" : "none"} 
                                        />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-primary ml-auto"
                                        onClick={() => handleShare(post)}
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Aucun post à afficher
                        </div>
                    )}
                </div>
            </div>
            
            <FloatingActionButton 
                onClick={handleCreatePost}
                className="bottom-[110px]"
            />
        </>
    );
} 