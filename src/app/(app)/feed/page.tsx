'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { postService } from "@/services/post.service";
import { Heart, MessageCircle, Bookmark, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share } from '@capacitor/share';
import { likeService } from "@/services/like.service";
import { favoriteService } from "@/services/favorite.service";
import { cn } from "@/lib/utils";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useRouter } from "next/navigation";
import { Post } from "@/types/postTypes";
import { Skeleton } from "@/components/ui/skeleton";

// Fonction utilitaire pour gérer les mises à jour optimistes
const handleOptimisticUpdate = (
    id: string,
    currentSet: Set<string>,
    setterFn: (value: Set<string>) => void,
    storageKey: string
) => {
    const isCurrentlyActive = currentSet.has(id);
    const newSet = new Set(currentSet);

    if (isCurrentlyActive) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }

    setterFn(newSet);
    sessionStorage.setItem(storageKey, JSON.stringify([...newSet]));
    return { isCurrentlyActive, newSet };
};

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    // Charger les données initiales
    useEffect(() => {
        loadPosts();
        ['likedPosts', 'bookmarkedPosts'].forEach(key => {
            const saved = sessionStorage.getItem(key);
            if (saved) {
                const setter = key === 'likedPosts' ? setLikedPosts : setBookmarkedPosts;
                setter(new Set(JSON.parse(saved)));
            }
        });
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const response = await postService.getPosts();
            
            // Trier les posts par date de création (du plus récent au plus ancien)
            const sortedPosts = response.data.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setPosts(sortedPosts);
        } catch {
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

    const handleLike = useCallback(async (postId: string) => {
        try {
            const { isCurrentlyActive, newSet } = handleOptimisticUpdate(
                postId,
                likedPosts,
                setLikedPosts,
                'likedPosts'
            );

            setPosts(posts => posts.map(post =>
                post.id === postId
                    ? { ...post, likesCount: post.likesCount + (isCurrentlyActive ? -1 : 1) }
                    : post
            ));

            const response = await likeService.togglePostLike(postId);

            if (response.status !== 'success') {
                setLikedPosts(likedPosts);
                sessionStorage.setItem('likedPosts', JSON.stringify([...likedPosts]));
                setPosts(posts => posts.map(post =>
                    post.id === postId
                        ? { ...post, likesCount: response.data.likesCount }
                        : post
                ));
                throw new Error('Erreur lors du like');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour le like"
            });
        }
    }, [likedPosts, toast]);

    const handleComment = (postId: string) => {
        router.push(`/feed/${postId}/`);
    };

    const handleBookmark = useCallback(async (postId: string) => {
        try {
            const { isCurrentlyActive, newSet } = handleOptimisticUpdate(
                postId,
                bookmarkedPosts,
                setBookmarkedPosts,
                'bookmarkedPosts'
            );

            const response = await favoriteService.toggleFavorite(postId);

            if (response.status !== 'success') {
                setBookmarkedPosts(bookmarkedPosts);
                sessionStorage.setItem('bookmarkedPosts', JSON.stringify([...bookmarkedPosts]));
                throw new Error('Erreur lors de la mise à jour du favori');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour le favori"
            });
        }
    }, [bookmarkedPosts, toast]);

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
        } catch (error: any) {
            // Ne rien faire si l'utilisateur annule le partage
            if (error.message !== 'Share canceled') {
                console.error('Share error:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 px-4 md:px-8 lg:px-0 pb-[120px] pt-[100px]">
                <div className="max-w-2xl mx-auto space-y-6">
                    {[...Array(3)].map((_, index) => (
                        <div 
                            key={index}
                            className="bg-card rounded-lg p-4 md:p-6 shadow-xs space-y-4"
                        >
                            {/* En-tête du skeleton */}
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>

                            {/* Contenu du skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[90%]" />
                                <Skeleton className="h-4 w-[80%]" />
                            </div>

                            {/* Image du skeleton */}
                            <div className="relative aspect-4/3 md:aspect-video rounded-lg overflow-hidden">
                                <Skeleton className="h-full w-full" />
                            </div>

                            {/* Actions du skeleton */}
                            <div className="flex items-center gap-6 pt-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8 ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 px-4 md:px-8 lg:px-0 pb-[120px] pt-[100px]">
                {/* Container principal centré avec largeur max */}
                <div className="max-w-2xl mx-auto">
                    <main className="space-y-6">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-card rounded-lg p-4 md:p-6 shadow-xs space-y-4"
                                >
                                    {/* En-tête du post */}
                                    <div className="flex gap-3">
                                        <Avatar className="h-10 w-10 md:h-12 md:w-12">
                                            <AvatarFallback>
                                                {post.user?.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-base md:text-lg">
                                                    {post.user?.username}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(post.createdAt), {
                                                        addSuffix: false,
                                                        locale: fr
                                                    })}
                                                </span>
                                            </div>
                                            <h2 className="text-sm md:text-base text-muted-foreground mt-0.5">
                                                {post.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Contenu du post */}
                                    <div className="text-sm md:text-base">
                                        {post.content}
                                    </div>

                                    {/* Media du post */}
                                    {post.media && post.media.length > 0 && (
                                        <div className="flex flex-col">
                                            <div className="relative aspect-4/3 md:aspect-video rounded-lg overflow-hidden">
                                                <Image
                                                    src={post.media[0].url}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions du post */}
                                    <div className="flex items-center gap-6 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "text-muted-foreground hover:text-primary flex items-center gap-1.5 group md:text-base",
                                                likedPosts.has(post.id) && "text-primary"
                                            )}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <Heart
                                                className={cn(
                                                    "h-5 w-5 md:h-6 md:w-6 transition-all duration-300",
                                                    likedPosts.has(post.id)
                                                        ? "scale-110 fill-current"
                                                        : "scale-100 fill-none"
                                                )}
                                                strokeWidth={2}
                                            />
                                            <span className="text-sm md:text-base transition-all duration-300">
                                                {post.likesCount}
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
                                                "text-muted-foreground hover:text-primary flex items-center gap-1.5 group md:text-base",
                                                bookmarkedPosts.has(post.id) && "text-primary"
                                            )}
                                            onClick={() => handleBookmark(post.id)}
                                        >
                                            <Bookmark
                                                className={cn(
                                                    "h-5 w-5 md:h-6 md:w-6 transition-all duration-300",
                                                    bookmarkedPosts.has(post.id)
                                                        ? "scale-110 fill-current"
                                                        : "scale-100 fill-none"
                                                )}
                                                strokeWidth={2}
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
                    </main>
                </div>
            </div>

            {/* Bouton flottant - masqué sur desktop */}
            <div className="lg:hidden">
                <FloatingActionButton
                    onClick={() => router.push('/feed/create')}
                    className="bottom-[110px]"
                />
            </div>
        </>
    );
} 