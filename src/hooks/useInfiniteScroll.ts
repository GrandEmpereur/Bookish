import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    loading: boolean;
    onLoadMore: () => void;
    threshold?: number; // Pourcentage du scroll pour déclencher le chargement (0.8 = 80%)
    rootMargin?: string; // Marge pour l'Intersection Observer
}

export const useInfiniteScroll = ({
    hasMore,
    loading,
    onLoadMore,
    threshold = 0.8,
    rootMargin = '100px'
}: UseInfiniteScrollOptions) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Fonction pour déclencher le chargement
    const handleLoadMore = useCallback(() => {
        if (hasMore && !loading) {
            onLoadMore();
        }
    }, [hasMore, loading, onLoadMore]);

    // Configuration de l'Intersection Observer
    useEffect(() => {
        if (!loadMoreRef.current) return;

        // Nettoyage de l'observer précédent
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Création du nouvel observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        handleLoadMore();
                    }
                });
            },
            {
                rootMargin,
                threshold: 0.1 // Déclenche quand 10% de l'élément est visible
            }
        );

        // Observer l'élément de référence
        observerRef.current.observe(loadMoreRef.current);

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleLoadMore, rootMargin]);

    // Alternative avec scroll listener pour navigateurs non compatibles
    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loading) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            if (scrollPercentage >= threshold) {
                handleLoadMore();
            }
        };

        // Fallback si Intersection Observer n'est pas supporté
        if (!window.IntersectionObserver) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loading, threshold, handleLoadMore]);

    return { loadMoreRef };
}; 