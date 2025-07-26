"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { searchService } from "@/services/search.service";
import { useDebounce } from "@/hooks/use-debounce";
import { GeneralSearchResponse } from "@/types/searchTypes";

// Extend SearchCategory to include "authors"
export type SearchCategory = "all" | "users" | "books" | "clubs" | "book_lists" | "authors";
import { toast } from "sonner";

interface SearchState {
    query: string;
    results: any | null;
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
    suggestions: string[];
}

interface AdvancedSearchFilters {
    category: SearchCategory;
}

interface UseAdvancedSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
}

interface UseInfiniteSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
    limit?: number;
}

interface SearchResult {
    id: string;
    type: string;
    [key: string]: any;
}

interface UseInfiniteSearchReturn {
    query: string;
    results: SearchResult[];
    loading: boolean;
    initialLoading: boolean;
    hasMore: boolean;
    error: string | null;
    hasSearched: boolean;
    suggestions: string[];
    totals: any;
    currentCategory: SearchCategory;
    loadMore: () => void;
    setQuery: (query: string) => void;
    changeCategory: (category: SearchCategory) => void;
    clearSearch: () => void;
    refresh: () => void;
}

export const useAdvancedSearch = (options: UseAdvancedSearchOptions = {}) => {
    const { debounceMs = 1000, minQueryLength = 1 } = options;

    const [state, setState] = useState<SearchState>({
        query: "",
        results: null,
        loading: false,
        error: null,
        hasSearched: false,
        suggestions: []
    });

    const [filters, setFilters] = useState<AdvancedSearchFilters>({
        category: "all"
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        hasMore: false
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const debouncedQuery = useDebounce(state.query, debounceMs);

    const performSearch = useCallback(async (query: string, category: SearchCategory = "all", page: number = 1) => {
        if (query.length < minQueryLength) {
            setState(prev => ({
                ...prev,
                results: null,
                hasSearched: false
            }));
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response: GeneralSearchResponse = await searchService.searchGeneral({
                query,
                page,
                limit: 20
            });

            if (response.status === "success" && response.data?.results) {
                let resultsToShow;

                // Simple : "all" = unified, sinon = grouped[category]
                if (category === "all") {
                    resultsToShow = response.data.results.unified || [];
                } else {
                    resultsToShow = response.data.results.grouped?.[category]?.data || [];
                }

                setState(prev => ({
                    ...prev,
                    results: {
                        data: page === 1 ? resultsToShow : [...(prev.results?.data || []), ...resultsToShow],
                        totals: response.data.totals,
                        pagination: response.data.pagination,
                        category,
                        fullResults: response.data.results, // Pour garder accès complet
                        currentPage: page,
                        loadedCount: page === 1 ? resultsToShow.length : (prev.results?.loadedCount || 0) + resultsToShow.length
                    },
                    loading: false,
                    hasSearched: true,
                    suggestions: response.data.metrics?.suggestions || []
                }));

                // Calculer hasMore en fonction de la limite de 100 et des résultats disponibles
                const currentLoadedCount = page === 1 ? resultsToShow.length : (state.results?.loadedCount || 0) + resultsToShow.length;
                const categoryTotals = response.data.totals;
                let maxPossibleResults = 0;

                switch (category) {
                    case "all":
                        maxPossibleResults = categoryTotals?.total || 0;
                        break;
                    case "authors":
                        maxPossibleResults = categoryTotals?.authors || 0;
                        break;
                    case "users":
                        maxPossibleResults = categoryTotals?.users || 0;
                        break;
                    case "books":
                        maxPossibleResults = categoryTotals?.books || 0;
                        break;
                    case "clubs":
                        maxPossibleResults = categoryTotals?.clubs || 0;
                        break;
                    case "book_lists":
                        maxPossibleResults = categoryTotals?.book_lists || 0;
                        break;
                }

                // Limite à 100 résultats max
                const maxToLoad = Math.min(maxPossibleResults, 100);
                const hasMoreResults = currentLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                setPagination({
                    page,
                    limit: 20,
                    hasMore: hasMoreResults
                });
            } else {
                setState(prev => ({
                    ...prev,
                    results: null,
                    loading: false,
                    hasSearched: true,
                    error: "Aucun résultat trouvé"
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: "Erreur lors de la recherche",
                results: null
            }));
        }
    }, [minQueryLength]);

    // Fonction pour charger plus de résultats (scroll infini fluide)
    const loadMore = useCallback(async () => {
        if (!state.results || !pagination.hasMore || state.loading) return;

        const currentLoadedCount = state.results.loadedCount || state.results.data.length;
        if (currentLoadedCount >= 100) return; // Limite à 100 éléments

        const nextPage = pagination.page + 1;
        const currentCategory = state.results.category;

        setState(prev => ({ ...prev, loading: true }));

        try {
            let response: any;

            // Toujours utiliser l'API spécifique pour un chargement fluide
            if (currentCategory === "all") {
                response = await searchService.searchGeneral({
                    query: state.query,
                    page: nextPage,
                    limit: 20
                });

                if (response.status === "success" && response.data?.results) {
                    const newResults = response.data.results.unified || [];
                    const updatedData = [...(state.results.data || []), ...newResults];
                    const newLoadedCount = updatedData.length;

                    setState(prev => ({
                        ...prev,
                        results: {
                            ...prev.results,
                            data: updatedData,
                            loadedCount: newLoadedCount
                        },
                        loading: false
                    }));

                    // Vérifier s'il faut continuer à charger
                    const maxToLoad = Math.min(response.data.totals?.total || 0, 100);
                    const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                    setPagination(prev => ({
                        ...prev,
                        page: nextPage,
                        hasMore: hasMoreResults
                    }));
                }
            } else {
                // Utiliser les endpoints spécifiques pour les catégories
                switch (currentCategory) {
                    case "authors":
                        response = await searchService.searchAuthors({
                            query: state.query,
                            page: nextPage,
                            limit: 20,
                            category: "all"
                        });
                        console.log("Authors response:", response);
                        if (response.status === "success") {
                            const newResults = response.data.users || [];
                            const updatedData = [...(state.results.data || []), ...newResults];
                            const newLoadedCount = updatedData.length;

                            setState(prev => ({
                                ...prev,
                                results: {
                                    ...prev.results,
                                    data: updatedData,
                                    loadedCount: newLoadedCount
                                },
                                loading: false
                            }));

                            const maxToLoad = Math.min(state.results.totals?.users || 0, 100);
                            const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                            setPagination(prev => ({
                                ...prev,
                                page: nextPage,
                                hasMore: hasMoreResults
                            }));
                        }
                        break;

                    case "users":
                        response = await searchService.searchUsers({
                            query: state.query,
                            page: nextPage,
                            limit: 20
                        });
                        if (response.status === "success") {
                            const newResults = response.data.users || [];
                            const updatedData = [...(state.results.data || []), ...newResults];
                            const newLoadedCount = updatedData.length;

                            setState(prev => ({
                                ...prev,
                                results: {
                                    ...prev.results,
                                    data: updatedData,
                                    loadedCount: newLoadedCount
                                },
                                loading: false
                            }));

                            const maxToLoad = Math.min(state.results.totals?.users || 0, 100);
                            const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                            setPagination(prev => ({
                                ...prev,
                                page: nextPage,
                                hasMore: hasMoreResults
                            }));
                        }
                        break;

                    case "books":
                        response = await searchService.searchBooks({
                            query: state.query,
                            page: nextPage,
                            limit: 20
                        });
                        if (response.status === "success") {
                            const newResults = response.data.books || [];
                            const updatedData = [...(state.results.data || []), ...newResults];
                            const newLoadedCount = updatedData.length;

                            setState(prev => ({
                                ...prev,
                                results: {
                                    ...prev.results,
                                    data: updatedData,
                                    loadedCount: newLoadedCount
                                },
                                loading: false
                            }));

                            const maxToLoad = Math.min(state.results.totals?.books || 0, 100);
                            const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                            setPagination(prev => ({
                                ...prev,
                                page: nextPage,
                                hasMore: hasMoreResults
                            }));
                        }
                        break;

                    case "clubs":
                        response = await searchService.searchClubs({
                            query: state.query,
                            page: nextPage,
                            limit: 20
                        });
                        if (response.status === "success") {
                            const newResults = response.data.clubs || [];
                            const updatedData = [...(state.results.data || []), ...newResults];
                            const newLoadedCount = updatedData.length;

                            setState(prev => ({
                                ...prev,
                                results: {
                                    ...prev.results,
                                    data: updatedData,
                                    loadedCount: newLoadedCount
                                },
                                loading: false
                            }));

                            const maxToLoad = Math.min(state.results.totals?.clubs || 0, 100);
                            const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                            setPagination(prev => ({
                                ...prev,
                                page: nextPage,
                                hasMore: hasMoreResults
                            }));
                        }
                        break;

                    case "book_lists":
                        response = await searchService.searchBookLists({
                            query: state.query,
                            page: nextPage,
                            limit: 20
                        });
                        if (response.status === "success") {
                            const newResults = response.data.book_lists || [];
                            const updatedData = [...(state.results.data || []), ...newResults];
                            const newLoadedCount = updatedData.length;

                            setState(prev => ({
                                ...prev,
                                results: {
                                    ...prev.results,
                                    data: updatedData,
                                    loadedCount: newLoadedCount
                                },
                                loading: false
                            }));

                            const maxToLoad = Math.min(state.results.totals?.book_lists || 0, 100);
                            const hasMoreResults = newLoadedCount < maxToLoad && (response.data.pagination?.has_more || false);

                            setPagination(prev => ({
                                ...prev,
                                page: nextPage,
                                hasMore: hasMoreResults
                            }));
                        }
                        break;
                }
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: "Erreur lors du chargement"
            }));
        }
    }, [state.results, state.query, state.loading, pagination.page, pagination.hasMore]);

    // Recherche automatique quand query change
    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery, filters.category, 1); // Reset à la page 1
        }
    }, [debouncedQuery, performSearch]);

    // Fonction pour changer de catégorie (simple et fluide)
    const changeCategory = useCallback(async (newCategory: SearchCategory) => {
        setFilters(prev => ({ ...prev, category: newCategory }));

        if (state.query && state.results?.fullResults) {
            // Utiliser les résultats déjà chargés
            let resultsToShow;
            if (newCategory === "all") {
                resultsToShow = state.results.fullResults.unified || [];
            } else {
                resultsToShow = state.results.fullResults.grouped?.[newCategory]?.data || [];
            }

            setState(prev => ({
                ...prev,
                results: {
                    ...prev.results,
                    data: resultsToShow,
                    category: newCategory,
                    loadedCount: resultsToShow.length
                }
            }));

            // Calculer s'il y a plus de résultats disponibles
            const categoryTotals = state.results?.totals;
            let categoryCount = 0;
            if (categoryTotals) {
                switch (newCategory) {
                    case "all":
                        categoryCount = categoryTotals.total || 0;
                        break;
                    case "users":
                        categoryCount = categoryTotals.users || 0;
                        break;
                    case "books":
                        categoryCount = categoryTotals.books || 0;
                        break;
                    case "clubs":
                        categoryCount = categoryTotals.clubs || 0;
                        break;
                    case "book_lists":
                        categoryCount = categoryTotals.book_lists || 0;
                        break;
                }
            }

            // Mettre à jour la pagination de façon simple
            const maxToLoad = Math.min(categoryCount, 100);
            setPagination(prev => ({
                ...prev,
                page: 1,
                hasMore: resultsToShow.length < maxToLoad
            }));
        }
    }, [state.query, state.results]);

    const setQuery = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));
    }, []);

    const clearSearch = useCallback(() => {
        setState({
            query: "",
            results: null,
            loading: false,
            error: null,
            hasSearched: false,
            suggestions: []
        });
        setFilters({ category: "all" });
    }, []);

    return {
        // État
        query: state.query,
        results: state.results?.data || [],
        fullResults: state.results?.fullResults,
        totals: state.results?.totals,
        loading: state.loading,
        error: state.error,
        hasSearched: state.hasSearched,
        suggestions: state.suggestions,

        // Filtres et pagination
        filters,
        pagination,

        // Actions
        setQuery,
        performSearch,
        changeCategory,
        clearSearch,
        loadMore
    };
};

export const useInfiniteSearch = (options: UseInfiniteSearchOptions = {}): UseInfiniteSearchReturn => {
    const { debounceMs = 500, minQueryLength = 1, limit = 20 } = options;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [totals, setTotals] = useState<any>(null);
    const [currentCategory, setCurrentCategory] = useState<SearchCategory>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [fullResults, setFullResults] = useState<any>(null);

    const loadingRef = useRef(false);
    const debouncedQuery = useDebounce(query, debounceMs);

    // Fonction principale de recherche
    const performSearch = useCallback(async (
        searchQuery: string,
        category: SearchCategory = "all",
        page: number = 1,
        append: boolean = false
    ) => {
        if (searchQuery.length < minQueryLength) {
            setResults([]);
            setHasSearched(false);
            setHasMore(false);
            return;
        }

        if (loadingRef.current) return;
        loadingRef.current = true;

        setLoading(true);
        setError(null);
        if (page === 1) setInitialLoading(true);

        try {
            let response: any;
            let newResults: SearchResult[] = [];

            // Choisir l'API appropriée selon la catégorie
            if (category === "all") {
                response = await searchService.searchGeneral({
                    query: searchQuery,
                    page,
                    limit
                });

                if (response.status === "success" && response.data?.results) {
                    newResults = response.data.results.unified || [];
                    if (page === 1) {
                        setTotals(response.data.totals);
                        setFullResults(response.data.results);
                        setSuggestions(response.data.metrics?.suggestions || []);
                    }
                }
            } else {
                // Utiliser les endpoints spécifiques pour une pagination réelle
                switch (category) {
               case "authors":
                response = await searchService.searchAuthors({
                    query: searchQuery,
                    page,
                    limit,
                    category: "all"
                });
                console.error("Authors response:", response);
                if (response.status === "success") {
                    newResults = (response.data.authors || []).map((author: any) => ({
                    ...author,
                    type: "author"
                    }));
                }
                break;

                    case "users":
                        response = await searchService.searchUsers({
                            query: searchQuery,
                            page,
                            limit
                        });
                        if (response.status === "success") {
                            newResults = (response.data.users || []).map((user: any) => ({
                                ...user,
                                type: "user"
                            }));
                        }
                        break;

                    case "books":
                        response = await searchService.searchBooks({
                            query: searchQuery,
                            page,
                            limit
                        });
                        if (response.status === "success") {
                            newResults = (response.data.books || []).map((book: any) => ({
                                ...book,
                                type: "book"
                            }));
                        }
                        break;

                    case "clubs":
                        response = await searchService.searchClubs({
                            query: searchQuery,
                            page,
                            limit
                        });
                        if (response.status === "success") {
                            newResults = (response.data.clubs || []).map((club: any) => ({
                                ...club,
                                type: "club"
                            }));
                        }
                        break;

                    case "book_lists":
                        response = await searchService.searchBookLists({
                            query: searchQuery,
                            page,
                            limit
                        });
                        if (response.status === "success") {
                            newResults = (response.data.book_lists || []).map((list: any) => ({
                                ...list,
                                type: "book_list"
                            }));
                        }
                        break;
                }
            }

            if (response.status === "success") {
                setResults(prevResults => {
                    if (append) {
                        // Éviter les doublons
                        const existingIds = new Set(prevResults.map(r => r.id));
                        const filteredNewResults = newResults.filter(r => !existingIds.has(r.id));
                        const updatedResults = [...prevResults, ...filteredNewResults];

                        // Limite à 100 résultats max
                        return updatedResults.slice(0, 100);
                    }
                    return newResults.slice(0, 100);
                });

                setCurrentPage(page);
                setHasSearched(true);

                // Calculer hasMore (limite à 100)
                const currentCount = append ? results.length + newResults.length : newResults.length;
                const limitedCount = Math.min(currentCount, 100);
                setHasMore(
                    limitedCount < 100 &&
                    (response.data.pagination?.has_more || false) &&
                    newResults.length === limit
                );

            } else {
                setError("Aucun résultat trouvé");
                if (!append) {
                    setResults([]);
                }
            }

        } catch (error) {
            const errorMessage = "Erreur lors de la recherche";
            setError(errorMessage);
            if (!append) {
                setResults([]);
            }
        } finally {
            setLoading(false);
            setInitialLoading(false);
            loadingRef.current = false;
        }
    }, [minQueryLength, limit]);

    // Recherche automatique lors du changement de query
    useEffect(() => {
        if (debouncedQuery) {
            setCurrentPage(1);
            performSearch(debouncedQuery, currentCategory, 1, false);
        } else {
            setResults([]);
            setHasSearched(false);
            setHasMore(false);
        }
    }, [debouncedQuery, currentCategory, performSearch]);

    // Fonction pour charger plus de résultats
    const loadMore = useCallback(() => {
        if (hasMore && !loading && !loadingRef.current && query) {
            performSearch(query, currentCategory, currentPage + 1, true);
        }
    }, [hasMore, loading, query, currentCategory, currentPage, performSearch]);

    // Fonction pour changer de catégorie
    const changeCategory = useCallback((newCategory: SearchCategory) => {
        setCurrentCategory(newCategory);
        setCurrentPage(1);

        // Si on a une recherche active, relancer avec la nouvelle catégorie
        if (query) {
            setResults([]);
            performSearch(query, newCategory, 1, false);
        }
    }, [query, performSearch]);

    // Fonction pour nettoyer la recherche
    const clearSearch = useCallback(() => {
        setQuery("");
        setResults([]);
        setHasSearched(false);
        setHasMore(false);
        setError(null);
        setTotals(null);
        setCurrentPage(1);
        setSuggestions([]);
    }, []);

    // Fonction pour rafraîchir
    const refresh = useCallback(() => {
        if (query) {
            setResults([]);
            setCurrentPage(1);
            performSearch(query, currentCategory, 1, false);
        }
    }, [query, currentCategory, performSearch]);

    // Calculer les totaux par catégorie
    const getBadgeCount = useCallback((category: SearchCategory) => {
        if (!totals) return 0;

        switch (category) {
            case "all":
                return totals.total || 0;
            case "users":
                return totals.users || 0;
            case "books":
                return totals.books || 0;
            case "clubs":
                return totals.clubs || 0;
            case "book_lists":
                return totals.book_lists || 0;
            default:
                return 0;
        }
    }, [totals]);

    return {
        query,
        results,
        loading,
        initialLoading,
        hasMore,
        error,
        hasSearched,
        suggestions,
        totals: totals ? { ...totals, getBadgeCount } : null,
        currentCategory,
        loadMore,
        setQuery,
        changeCategory,
        clearSearch,
        refresh
    };
};

export type { SearchCategory };
