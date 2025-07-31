"use client";

import { ClubPost } from "@/types/clubTypes";
import { Heart, MessageCircle, Share2, MoreVertical, Pin, PinOff, Trash2, UserMinus } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeFormatDistanceToNow } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";

interface ClubPostCardProps {
  post: ClubPost;
  onShare?: (post: ClubPost) => void;
  onClick?: () => void;
  canModerate?: boolean;
  onDelete?: (postId: string) => void;
  onPin?: (postId: string) => void;
  onBanUser?: (userId: string, username: string) => void;
}

export const ClubPostCard = ({ 
  post, 
  onShare, 
  onClick, 
  canModerate, 
  onDelete, 
  onPin, 
  onBanUser 
}: ClubPostCardProps) => {
  const profileImage = post.user?.profile_picture_path;

  const handleShare = async () => {
    // Transformer le ClubPost en format Post pour le ShareDialog
    const postForDialog = {
      id: post.id,
      title: post.title,
      content: post.content,
      user: post.user
    };

    // Appeler onShare avec le dialog
    onShare?.(postForDialog as any);
  };

  return (
    <article
      onClick={onClick}
      className={cn(
        "rounded-lg p-4 md:p-6 shadow-xs space-y-4 relative",
        post.isPinned 
          ? "bg-warning-100 border-2 border-warning-300" 
          : "bg-card"
      )}
    >
      {/* Header */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 md:h-12 md:w-12">
          {profileImage && (
            <AvatarImage src={profileImage} alt={post.user?.username} />
          )}
          <AvatarFallback>
            {post.user?.username ? post.user.username.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-base md:text-lg">
              {post.user?.username || "Utilisateur"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {safeFormatDistanceToNow(post.created_at || post.createdAt)}
              </span>
              {/* Menu de modération */}
              {canModerate && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPin?.(post.id);
                      }}
                    >
                      {post.isPinned ? (
                        <>
                          <PinOff className="h-4 w-4 mr-2" />
                          Désépingler le post
                        </>
                      ) : (
                        <>
                          <Pin className="h-4 w-4 mr-2" />
                          Épingler le post
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(post.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer le post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBanUser?.(post.user?.id || '', post.user?.username || 'Utilisateur');
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Bannir l'auteur
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-sm md:text-base text-muted-foreground">
              {post.title}
            </h2>
            {/* Indicateur post épinglé */}
            {post.isPinned && (
              <div className="flex items-center gap-1 px-3 py-1 bg-warning-300 text-warning-800 rounded-full text-xs font-semibold shadow-sm">
                <Pin className="h-3 w-3 fill-current" />
                ÉPINGLÉ
              </div>
            )}
          </div>
          
          {/* Badge épinglé en position absolue */}
          {post.isPinned && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-warning-300 text-warning-800 rounded-full text-xs font-bold shadow-md">
              <Pin className="h-3 w-3 fill-current" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="text-sm md:text-base whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* Image */}
      {post.images.length > 0 && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={post.images[0].url}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions (read-only counters) */}
      <div className="flex items-center gap-6 pt-2 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <Heart className="h-5 w-5" />
          {Number(post.likes_count)}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-5 w-5" />
          {Number(post.comments_count)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </article>
  );
};
