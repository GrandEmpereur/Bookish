"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Loader2,
  RefreshCw,
  Flag,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share } from "@capacitor/share";
import { likeService } from "@/services/like.service";
import { favoriteService } from "@/services/favorite.service";
import { cn } from "@/lib/utils";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useRouter } from "next/navigation";
import { Post } from "@/types/postTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Capacitor } from "@capacitor/core";
import { ShareDialog } from "@/components/ui/share-dialog";
import { ReportDialog } from "@/components/ui/report-dialog";
import { QuickReportButton } from "@/components/ui/quick-report-button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

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
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set()
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Détection de la plateforme
  const isNative = Capacitor.isNativePlatform();
  const isBrowser = !isNative;

  // Utilisation du hook pour le scroll infini
  const {
    posts,
    loading,
    initialLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    updatePost,
    pagination,
  } = useInfinitePosts({
    orderBy: "created_at",
    orderDirection: "desc",
    limit: 20,
  });

  // Fonction de refresh (déclarée avant les hooks qui l'utilisent)
  const handleRefresh = useCallback(() => {
    refresh();
    // Effacer le cache local lors du refresh
    sessionStorage.removeItem("likedPosts");
    sessionStorage.removeItem("bookmarkedPosts");
    setLikedPosts(new Set());
    setBookmarkedPosts(new Set());
  }, [refresh]);

  // Configuration du scroll infini
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 0.8,
    rootMargin: "200px",
  });

  // Charger les données de session au montage
  useEffect(() => {
    try {
      const savedLikes = sessionStorage.getItem("likedPosts");
      if (savedLikes) {
        const likedArray = JSON.parse(savedLikes) as string[];
        setLikedPosts(new Set(likedArray));
      }

      const savedBookmarks = sessionStorage.getItem("bookmarkedPosts");
      if (savedBookmarks) {
        const bookmarkedArray = JSON.parse(savedBookmarks) as string[];
        setBookmarkedPosts(new Set(bookmarkedArray));
      }
    } catch (error) {
      console.warn(
        "Erreur lors du chargement des données depuis sessionStorage:",
        error
      );
      // En cas d'erreur, nettoyer le storage corrompu
      sessionStorage.removeItem("likedPosts");
      sessionStorage.removeItem("bookmarkedPosts");
    }
  }, []);

  // Les états de like/bookmark sont gérés uniquement via sessionStorage
  // car l'API backend ne retourne pas ces informations dans les posts

  const handleLike = useCallback(
    async (postId: string) => {
      try {
        const { isCurrentlyActive } = handleOptimisticUpdate(
          postId,
          likedPosts,
          setLikedPosts,
          "likedPosts"
        );

        // Mise à jour optimiste du compteur
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          const newLikesCount = isCurrentlyActive
            ? Math.max(0, currentPost.likesCount - 1) // Unlike
            : currentPost.likesCount + 1; // Like

          updatePost(postId, { likesCount: newLikesCount });
        }

        const response = await likeService.togglePostLike(postId);

        if (response.status !== "success") {
          // Restaurer l'état précédent en cas d'erreur
          setLikedPosts(likedPosts);
          sessionStorage.setItem("likedPosts", JSON.stringify([...likedPosts]));

          // Restaurer aussi le compteur
          if (currentPost) {
            updatePost(postId, { likesCount: currentPost.likesCount });
          }

          throw new Error("Erreur lors du like");
        }
      } catch (error) {
        toast.error("Impossible de mettre à jour le like");
      }
    },
    [likedPosts, posts, updatePost]
  );

  const handleComment = (postId: string) => {
    router.push(`/feed/${postId}/`);
  };

  const handleBookmark = useCallback(
    async (postId: string) => {
      try {
        handleOptimisticUpdate(
          postId,
          bookmarkedPosts,
          setBookmarkedPosts,
          "bookmarkedPosts"
        );

        const response = await favoriteService.toggleFavorite(postId);

        if (response.status !== "success") {
          // Restaurer l'état précédent en cas d'erreur
          setBookmarkedPosts(bookmarkedPosts);
          sessionStorage.setItem(
            "bookmarkedPosts",
            JSON.stringify([...bookmarkedPosts])
          );
          throw new Error("Erreur lors de la mise à jour du favori");
        }
      } catch (error) {
        toast.error("Impossible de mettre à jour le favori");
      }
    },
    [bookmarkedPosts]
  );

  const handleShare = async (post: Post) => {
    // Vérifier si on peut utiliser le partage natif (mobile/Capacitor)
    const canUseNativeShare = Capacitor.isNativePlatform();

    if (canUseNativeShare) {
      try {
        const shareOptions = {
          title: post.title,
          text: `Découvrez ce post de ${post.user?.username} sur Bookish`,
          url: `${window.location.origin}/feed/${post.id}`,
          dialogTitle: "Partager ce post",
          ...(post.media &&
            post.media.length > 0 && {
              files: [post.media[0].url],
            }),
        };

        await Share.share(shareOptions);
      } catch (error: any) {
        // Ne rien faire si l'utilisateur annule le partage
        if (error.message !== "Share canceled") {
          console.error("Share error:", error);
          // Fallback vers le dialog desktop
          setSelectedPost(post);
          setShareDialogOpen(true);
        }
      }
    } else {
      // Desktop : ouvrir le dialog de partage
      setSelectedPost(post);
      setShareDialogOpen(true);
    }
  };

  const handleReport = (post: Post) => {
    setSelectedPost(post);
    setReportDialogOpen(true);
  };

  // Skeleton de chargement initial
  if (initialLoading) {
    return (
      <div className="flex-1 px-4 md:px-8 lg:px-0 pb-[120px] pt-25 md:pt-[90px]">
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
      <div
        className={cn(
          "flex-1 px-4 md:px-8 lg:px-0 pb-[120px]",
          isNative ? "pt-[130px]" : "pt-[90px]"
        )}
      >
        {/* Container principal centré avec largeur max */}
        <div className="max-w-2xl mx-auto">
          <main className="space-y-6">
            {error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Réessayer
                </Button>
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                {posts.map((post) => (
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
                              locale: fr,
                            })}
                          </span>
                        </div>
                        <h2 className="text-sm md:text-base text-muted-foreground mt-0.5">
                          {post.title}
                        </h2>
                      </div>
                    </div>

                    {/* Contenu du post */}
                    <div className="text-sm md:text-base">{post.content}</div>

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
                    <div className="flex items-center justify-between pt-2">
                      {/* Actions principales */}
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-muted-foreground hover:text-primary flex items-center gap-1.5 group md:text-base",
                            likedPosts.has(post.id) && "text-like"
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
                      </div>

                      {/* Actions secondaires */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => handleShare(post)}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>

                        {/* Mobile: Signalement rapide */}
                        <div className="md:hidden">
                          <QuickReportButton
                            postId={post.id}
                            postUserId={post.userId}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                          />
                        </div>

                        {/* Desktop: Dialog complet - uniquement si ce n'est pas son propre post */}
                        {user &&
                          (user as any).user &&
                          (user as any).user.id !== post.userId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hidden md:flex text-muted-foreground hover:text-destructive"
                              onClick={() => handleReport(post)}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                  </article>
                ))}

                {/* Élément observé pour le scroll infini */}
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  {loading && hasMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Chargement...</span>
                    </div>
                  )}
                  {!hasMore && posts.length > 0 && (
                    <p className="text-center text-muted-foreground">
                      🎉 Vous avez vu tous les posts !
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p className="mb-4">Aucun post à afficher</p>
                <Button onClick={handleRefresh} variant="outline">
                  Actualiser
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Bouton flottant - masqué sur desktop */}
      <div className="lg:hidden">
        <FloatingActionButton
          onClick={() => router.push("/feed/create")}
          className="bottom-[110px] w-14 h-14"
        />
      </div>

      {/* Dialogs */}
      {selectedPost && (
        <>
          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            post={selectedPost}
          />
          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            postId={selectedPost.id}
            postTitle={selectedPost.title}
            authorUsername={
              selectedPost.user?.username || "Utilisateur inconnu"
            }
          />
        </>
      )}
    </>
  );
}
