import { useState, useEffect, useCallback, useRef } from "react";
import { postService, PaginationParams } from "@/services/post.service";
import { Post } from "@/types/postTypes";
import { AdItem } from "@/types/adTypes";
import { FeedItem } from "@/services/post.service";
import { toast } from "sonner";

export interface UseInfinitePostsOptions {
  orderBy?: "created_at" | "updated_at" | "likes_count" | "comments_count";
  orderDirection?: "desc" | "asc";
  limit?: number;
  enabled?: boolean;
}

export interface UseInfinitePostsReturn {
  posts: FeedItem[];
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  } | null;
}

export const useInfinitePosts = (
  options: UseInfinitePostsOptions = {}
): UseInfinitePostsReturn => {
  const {
    orderBy = "created_at",
    orderDirection = "desc",
    limit = 20,
    enabled = true,
  } = options;

  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    total: number;
  } | null>(null);

  // Ref pour éviter les appels multiples
  const loadingRef = useRef(false);

  const loadPosts = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (loadingRef.current || !enabled) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params: PaginationParams = {
          page: pageNum,
          limit,
          orderBy,
          orderDirection,
        };

        const response = await postService.getPosts(params);

        if (response.status === "success") {
          const newPosts = response.data.posts;
          const paginationData = response.data.pagination;

          setPosts((prevPosts) => {
            // Éviter les doublons lors de l'ajout
            if (append) {
              const getItemId = (item: FeedItem): string =>
                (item as any).subject
                  ? (item as Post).id
                  : (item as AdItem).ad.id;
              const existingIds = new Set(prevPosts.map(getItemId));
              const filteredNewPosts = newPosts.filter(
                (item) => !existingIds.has(getItemId(item))
              );
              return [...prevPosts, ...filteredNewPosts];
            }
            return newPosts;
          });

          setHasMore(paginationData.has_more);
          setCurrentPage(paginationData.current_page);
          setPagination({
            currentPage: paginationData.current_page,
            totalPages: paginationData.total_pages,
            total: paginationData.total,
          });
        } else {
          setError(response.message || "Erreur lors du chargement");
          toast.error(response.message || "Impossible de charger les posts");
        }
      } catch (err) {
        const errorMessage = "Erreur réseau lors du chargement des posts";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        loadingRef.current = false;
      }
    },
    [orderBy, orderDirection, limit, enabled, posts.length]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !loadingRef.current) {
      loadPosts(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadPosts]);

  const refresh = useCallback(() => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setPagination(null);
    setInitialLoading(true);
    loadPosts(1, false);
  }, [loadPosts]);

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts((prevPosts) =>
      prevPosts.map((item) => {
        if ((item as any).subject && (item as Post).id === postId) {
          return { ...(item as Post), ...updates } as FeedItem;
        }
        return item;
      })
    );
  }, []);

  // Chargement initial
  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [orderBy, orderDirection, limit, enabled]);

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      loadingRef.current = false;
    };
  }, []);

  return {
    posts,
    loading,
    initialLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    updatePost,
    pagination,
  };
};
