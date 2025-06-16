"use client";

import { useEffect, useState } from "react";
import { postService } from "@/services/post.service";
import { Post } from "@/types/postTypes";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { CommentsSection } from "@/components/comments/comments-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GetPostResponse } from "@/types/postTypes";
import { toast } from "sonner";


interface PostDetailsProps {
  postId: string;
}

export function PostDetails({ postId }: PostDetailsProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const response = await postService.getPost(postId);
        setPost(response.data);
      } catch (error) {
        toast.error("Impossible de charger le post");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-[100px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center pt-[100px]">
        <p className="text-muted-foreground">Post non trouvé</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-5 pb-[120px] pt-[100px]">
      <div className="max-w-md mx-auto">
        <article className=" p-4">
          {/* En-tête du post avec avatar et infos utilisateur */}
          <div className="flex gap-3 mb-4">
            <Avatar>
              <AvatarFallback>
                {post.user?.username.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{post.user?.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
              <h2 className="text-sm text-muted-foreground mt-0.5">
                {post.title}
              </h2>
            </div>
          </div>

          {/* Contenu du post */}
          <div className="text-sm mb-4">{post.content}</div>

          <h3 className="font-medium text-lg mb-4">Commentaires</h3>

          {/* Section des commentaires */}
          <div>
            <CommentsSection postId={postId} />
          </div>
        </article>
      </div>
    </div>
  );
}
