'use client';

import { useEffect, useState } from 'react';
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
import { Post } from "@/types/post";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadPosts();
        // Charger les états depuis le sessionStorage
        const savedLikes = sessionStorage.getItem('likedPosts');
        const savedBookmarks = sessionStorage.getItem('bookmarkedPosts');

        if (savedLikes) setLikedPosts(new Set(JSON.parse(savedLikes)));
        if (savedBookmarks) setBookmarkedPosts(new Set(JSON.parse(savedBookmarks)));
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
            const response = await likeService.togglePostLike({ postId });

            if (response.status === 'success') {
                const isLiked = response.message === 'Post liked successfully';
                const newLikedPosts = new Set(likedPosts);

                if (isLiked) {
                    newLikedPosts.add(postId);
                    setPosts(currentPosts =>
                        currentPosts.map(post =>
                            post.id === postId
                                ? { ...post, likesCount: post.likesCount + 1 }
                                : post
                        )
                    );
                } else {
                    newLikedPosts.delete(postId);
                    setPosts(currentPosts =>
                        currentPosts.map(post =>
                            post.id === postId
                                ? { ...post, likesCount: post.likesCount - 1 }
                                : post
                        )
                    );
                }

                setLikedPosts(newLikedPosts);
                sessionStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
            }
        } catch (error) {
            console.error('Like error:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour le like"
            });
        }
    };

    const handleComment = (postId: string) => {
        router.push(`/feed/${postId}/`);
    };

    const handleBookmark = async (postId: string) => {
        try {
            const response = await favoriteService.toggleFavorite({ postId });

            if (response.status === 'success') {
                const newBookmarkedPosts = new Set(bookmarkedPosts);

                if (newBookmarkedPosts.has(postId)) {
                    newBookmarkedPosts.delete(postId);
                } else {
                    newBookmarkedPosts.add(postId);
                }

                setBookmarkedPosts(newBookmarkedPosts);
                sessionStorage.setItem('bookmarkedPosts', JSON.stringify([...newBookmarkedPosts]));
            }
        } catch (error) {
            console.error('Bookmark error:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour le favori"
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

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 px-5 pb-[120px] pt-[100px]">
                <div className="space-y-6">
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
                                            "text-muted-foreground hover:text-primary flex items-center gap-1.5 group",
                                            likedPosts.has(post.id) && "text-primary"
                                        )}
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <Heart
                                            className={cn(
                                                "h-5 w-5 transition-all duration-300",
                                                likedPosts.has(post.id)
                                                    ? "scale-110 fill-current"
                                                    : "scale-100 fill-none"
                                            )}
                                            strokeWidth={2}
                                        />
                                        <span className="text-sm transition-all duration-300">
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
                                            "text-muted-foreground hover:text-primary flex items-center gap-1.5 group",
                                            bookmarkedPosts.has(post.id) && "text-primary"
                                        )}
                                        onClick={() => handleBookmark(post.id)}
                                    >
                                        <Bookmark
                                            className={cn(
                                                "h-5 w-5 transition-all duration-300",
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
                </div>
            </div>

            <FloatingActionButton
                onClick={() => router.push('/feed/create')}
                className="bottom-[110px]"
            />
        </>
    );
} 