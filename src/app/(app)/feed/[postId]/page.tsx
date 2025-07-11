"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { postService } from "@/services/post.service";
import { Post } from "@/types/postTypes";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Flag,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { safeFormatDistanceToNow } from "@/lib/date";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share } from "@capacitor/share";
import { likeService } from "@/services/like.service";
import { favoriteService } from "@/services/favorite.service";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
import { ShareDialog } from "@/components/ui/share-dialog";
import { ReportDialog } from "@/components/ui/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { CommentsSection } from "@/components/comments/comments-section";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.postId as string;

  // Détection de la plateforme
  const isNative = Capacitor.isNativePlatform();
  const isBrowser = !isNative;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      loadPost();
      loadLocalStates();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPost(postId);

      if (response.status === "success") {
        setPost(response.data);
      } else {
        setError("Post non trouvé");
      }
    } catch (err) {
      console.error("Erreur lors du chargement du post:", err);
      setError("Impossible de charger le post");
    } finally {
      setLoading(false);
    }
  };

  const loadLocalStates = () => {
    try {
      const savedLikes = sessionStorage.getItem("likedPosts");
      if (savedLikes) {
        const likedArray = JSON.parse(savedLikes) as string[];
        setIsLiked(likedArray.includes(postId));
      }

      const savedBookmarks = sessionStorage.getItem("bookmarkedPosts");
      if (savedBookmarks) {
        const bookmarkedArray = JSON.parse(savedBookmarks) as string[];
        setIsBookmarked(bookmarkedArray.includes(postId));
      }
    } catch (error) {
      console.warn("Erreur lors du chargement des états locaux:", error);
    }
  };

  const updateLocalState = (key: string, value: boolean) => {
    try {
      const saved = sessionStorage.getItem(key);
      const array = saved ? (JSON.parse(saved) as string[]) : [];

      if (value && !array.includes(postId)) {
        array.push(postId);
      } else if (!value) {
        const index = array.indexOf(postId);
        if (index > -1) {
          array.splice(index, 1);
        }
      }

      sessionStorage.setItem(key, JSON.stringify(array));
    } catch (error) {
      console.warn(`Erreur lors de la mise à jour de ${key}:`, error);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    updateLocalState("likedPosts", newLikedState);

    // Mise à jour optimiste du compteur
    const newLikesCount = newLikedState
      ? post.likesCount + 1
      : Math.max(0, post.likesCount - 1);

    setPost({ ...post, likesCount: newLikesCount });

    try {
      const response = await likeService.togglePostLike(postId);

      if (response.status !== "success") {
        // Restaurer l'état précédent en cas d'erreur
        setIsLiked(!newLikedState);
        updateLocalState("likedPosts", !newLikedState);
        setPost({ ...post, likesCount: post.likesCount }); // Restaurer le compteur original
        throw new Error("Erreur lors du like");
      }
    } catch (error) {
      toast.error("Impossible de mettre à jour le like");
    }
  };

  const handleBookmark = async () => {
    if (!post) return;

    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    updateLocalState("bookmarkedPosts", newBookmarkedState);

    try {
      const response = await favoriteService.toggleFavorite(postId);

      if (response.status !== "success") {
        // Restaurer l'état précédent en cas d'erreur
        setIsBookmarked(!newBookmarkedState);
        updateLocalState("bookmarkedPosts", !newBookmarkedState);
        throw new Error("Erreur lors de la mise à jour du favori");
      }
    } catch (error) {
      toast.error("Impossible de mettre à jour le favori");
    }
  };

  const handleShare = async () => {
    if (!post) return;

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
        if (error.message !== "Share canceled") {
          console.error("Share error:", error);
          setShareDialogOpen(true);
        }
      }
    } else {
      setShareDialogOpen(true);
    }
  };

  const handleReport = () => {
    setReportDialogOpen(true);
  };

  const handleComment = () => {
    // Faire défiler vers la section commentaires
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "flex-1 px-4 md:px-8 lg:px-0 pb-[120px]",
          isNative ? "pt-[130px]" : "pt-[90px]"
        )}
      >
        <div className="max-w-2xl mx-auto">
          {/* Bouton retour */}
          <div className="mb-6">
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Post skeleton */}
          <div className="bg-card rounded-lg p-4 md:p-6 shadow-xs space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="flex items-center gap-6 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className={cn(
          "flex-1 px-4 md:px-8 lg:px-0 pb-[120px]",
          isNative ? "pt-[130px]" : "pt-[90px]"
        )}
      >
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Ce post n'existe pas ou a été supprimé."}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
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
        <div className="max-w-2xl mx-auto">
          {/* Bouton retour */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>

          {/* Post */}
          <article className="bg-card rounded-lg p-4 md:p-6 shadow-xs space-y-4">
            {/* En-tête du post */}
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {post.user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">
                    {post.user?.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {safeFormatDistanceToNow(post.createdAt, true)}
                  </span>
                </div>
                <h1 className="text-base text-muted-foreground mt-0.5 font-medium">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Contenu du post */}
            <div className="text-base leading-relaxed">{post.content}</div>

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
            <div className="flex items-center justify-between pt-4 border-t">
              {/* Actions principales */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-muted-foreground hover:text-primary flex items-center gap-2",
                    isLiked && "text-primary"
                  )}
                  onClick={handleLike}
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isLiked ? "scale-110 fill-current" : "scale-100 fill-none"
                    )}
                    strokeWidth={2}
                  />
                  <span className="text-base">{post.likesCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary flex items-center gap-2"
                  onClick={handleComment}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-base">{post.commentsCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-muted-foreground hover:text-primary flex items-center gap-2",
                    isBookmarked && "text-primary"
                  )}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isBookmarked
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
                  onClick={handleShare}
                >
                  <Share2 className="h-6 w-6" />
                </Button>

                {/* Bouton signalement - uniquement si ce n'est pas son propre post */}
                {user &&
                  (user as any).user &&
                  (user as any).user.id !== post.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleReport}
                    >
                      <Flag className="h-5 w-5" />
                    </Button>
                  )}
              </div>
            </div>
          </article>

          {/* Section commentaires */}
          <div id="comments-section" className="mt-8">
            <CommentsSection postId={postId} />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {post && (
        <>
          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            post={post}
          />
          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            postId={post.id}
            postTitle={post.title}
            authorUsername={post.user?.username || "Utilisateur inconnu"}
          />
        </>
      )}
    </>
  );
}
