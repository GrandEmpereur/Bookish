"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteSearch } from "@/hooks/useAdvancedSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SearchCategory } from "@/types/searchTypes";
import {
  recommendationService,
  RecommendedBook,
} from "@/services/recommendation.service";
import { toast } from "sonner";
import {
  BookOpen,
  List,
  Loader2,
  Search as SearchIcon,
  TrendingUp,
  Users,
  Users2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Star,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const TRENDING_SEARCHES = [
  "Harry Potter",
  "Dune",
  "Stephen King",
  "Romance contemporaine",
  "Science-fiction",
  "Fantasy épique",
  "Thriller psychologique",
  "Philosophie",
];

const CATEGORY_INFO = {
  all: {
    label: "Tout",
    icon: SearchIcon,
    description: "Recherchez dans tout Bookish",
  },
  users: {
    label: "Utilisateurs",
    icon: Users,
    description: "Trouvez des lecteurs et auteurs",
  },
  books: {
    label: "Livres",
    icon: BookOpen,
    description: "Découvrez votre prochaine lecture",
  },
  clubs: {
    label: "Clubs",
    icon: Users2,
    description: "Rejoignez des communautés",
  },
  book_lists: {
    label: "Listes",
    icon: List,
    description: "Explorez les sélections",
  },
} as const;

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory =
    (searchParams.get("category") as SearchCategory) || "all";

  const isNative = Capacitor.isNativePlatform();

  // States
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query,
    results,
    loading,
    initialLoading,
    hasMore,
    error,
    hasSearched,
    suggestions,
    totals,
    currentCategory,
    loadMore,
    setQuery,
    changeCategory,
    clearSearch,
    refresh,
  } = useInfiniteSearch({
    debounceMs: 500,
    minQueryLength: 1,
    limit: 20,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 0.8,
    rootMargin: "200px",
  });

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    try {
      setLoadingRecommendations(true);
      const response = await recommendationService.getBookRecommendations(10);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  // Initialize from URL params
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
    if (initialCategory !== currentCategory) {
      changeCategory(initialCategory);
    }
    // Load recommendations on page load
    loadRecommendations();
  }, []);

  // Update URL
  useEffect(() => {
    if (query || currentCategory !== "all") {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (currentCategory !== "all") params.set("category", currentCategory);

      const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [query, currentCategory, router]);

  const handleCategoryChange = (category: SearchCategory) => {
    changeCategory(category);
  };

  const handleTrendingSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const handleRecommendationFeedback = async (
    bookId: string,
    liked: boolean
  ) => {
    try {
      await recommendationService.sendFeedback({ bookId, liked });
      toast.success(
        liked ? "Merci pour votre retour positif !" : "Merci pour votre retour"
      );
    } catch (error) {
      toast.error("Erreur lors de l'envoi du feedback");
    }
  };

  const getBadgeCount = (category: SearchCategory) => {
    if (!totals?.getBadgeCount) return 0;
    return totals.getBadgeCount(category);
  };

  const translateRole = (role: string) => {
    const roleTranslations: { [key: string]: string } = {
      USER: "Utilisateur",
      AUTHOR: "Auteur",
      ADMIN: "Administrateur",
      MODERATOR: "Modérateur",
      PREMIUM: "Premium",
      CREATOR: "Créateur",
    };
    return roleTranslations[role?.toUpperCase()] || role || "Utilisateur";
  };

  const RecommendationCard = ({ book }: { book: RecommendedBook }) => (
    <Card className="group active:scale-95 transition-all duration-150 border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {book.cover_image ? (
            <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden shadow-sm">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-16 shrink-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-md flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {book.author}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {book.genre && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {book.genre}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <span className="text-xs font-medium">
                    {(book.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecommendationFeedback(book.id, true);
                  }}
                  className="h-7 w-7 p-0 touch-manipulation"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecommendationFeedback(book.id, false);
                  }}
                  className="h-7 w-7 p-0 touch-manipulation"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <div className="space-y-8">
      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Recommandé pour vous</h2>
          </div>
          <div className="grid gap-2">
            {recommendations.slice(0, 4).map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/books/${book.id}`)}
                className="cursor-pointer touch-manipulation"
              >
                <RecommendationCard book={book} />
              </div>
            ))}
          </div>
          {recommendations.length > 4 && (
            <Button
              variant="outline"
              onClick={() => router.push("/recommendations")}
              className="w-full h-11 touch-manipulation"
            >
              Voir plus de recommandations
            </Button>
          )}
        </div>
      )}

      {/* Welcome Section */}
      <div className="text-center space-y-4 py-6">
        <div className="relative inline-block">
          <SearchIcon className="h-12 w-12 text-primary/20" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Découvrez Bookish
          </h3>
          <p className="text-muted-foreground text-sm px-4">
            Recherchez des livres, des utilisateurs, des clubs et des listes
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Recherches populaires</h4>
          </div>
          <div className="flex flex-wrap gap-2 justify-center px-4">
            {TRENDING_SEARCHES.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => handleTrendingSearch(search)}
                className="text-xs h-8 px-3 touch-manipulation active:scale-95 transition-transform"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultItem = (item: any) => {
    const type = item.type || item.result_type;

    switch (type) {
      case "user":
        return (
          <Card
            key={item.id}
            className="active:scale-95 transition-all duration-150 cursor-pointer border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation"
            onClick={() => router.push(`/profile/${item.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {item.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate text-sm">
                      {item.username}
                    </h3>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {translateRole(item.profile?.role)}
                    </Badge>
                  </div>
                  {item.stats && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{item.stats.followers_count} abonnés</span>
                      <span>•</span>
                      <span>{item.stats.books_published} livres</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "book":
        return (
          <Card
            key={item.id}
            className="active:scale-95 transition-all duration-150 cursor-pointer border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation"
            onClick={() => router.push(`/books/${item.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex gap-3">
                {item.cover_image || item.coverImage ? (
                  <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden shadow-sm">
                    <Image
                      src={item.cover_image || item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-16 shrink-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-2 leading-tight text-sm">
                      {item.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 px-1.5 py-0.5"
                    >
                      LIVRE
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {item.author}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.genre && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {item.genre}
                      </Badge>
                    )}
                    {item.publicationYear && (
                      <span className="text-xs text-muted-foreground">
                        {item.publicationYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "club":
        return (
          <Card
            key={item.id}
            className="active:scale-95 transition-all duration-150 cursor-pointer border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation"
            onClick={() => router.push(`/clubs/${item.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                      {item.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 px-1.5 py-0.5"
                    >
                      CLUB
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>{item.memberCount || 0} membres</span>
                    {item.genre && (
                      <>
                        <span>•</span>
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.genre}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "book_list":
      case "bookList":
        return (
          <Card
            key={item.id}
            className="active:scale-95 transition-all duration-150 cursor-pointer border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation"
            onClick={() => router.push(`/library/${item.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shrink-0">
                  <List className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                      {item.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 px-1.5 py-0.5"
                    >
                      LISTE
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>{item.bookCount || 0} livres</span>
                    <span>•</span>
                    <span className="truncate">
                      {item.user?.username || item.creator?.username}
                    </span>
                    {item.visibility && (
                      <>
                        <span>•</span>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize px-1.5 py-0.5"
                        >
                          {item.visibility}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-8 space-y-4 px-4">
          <SearchIcon className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground text-sm">
              Aucun résultat pour "{query}" dans{" "}
              {CATEGORY_INFO[
                currentCategory as keyof typeof CATEGORY_INFO
              ]?.label.toLowerCase()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => changeCategory("all")}
              variant="outline"
              size="sm"
              className="h-9 px-3 touch-manipulation"
            >
              Recherche globale
            </Button>
            <Button
              onClick={clearSearch}
              variant="outline"
              size="sm"
              className="h-9 px-3 touch-manipulation"
            >
              Effacer
            </Button>
          </div>
        </div>
      );
    }

    const currentCount = results.length;
    const totalCount = getBadgeCount(currentCategory);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentCount} résultat{currentCount > 1 ? "s" : ""}
            {totalCount > 0 && ` sur ${totalCount}`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 h-9 px-3 touch-manipulation"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        <div className="grid gap-3">{results.map(renderResultItem)}</div>

        {/* Load more */}
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && hasMore && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          )}
          {!hasMore && currentCount > 0 && (
            <p className="text-center text-muted-foreground text-sm">
              🎉 Tous les résultats chargés !
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-background/80 pb-[120px]",
        isNative ? "pt-[120px]" : "pt-[100px]"
      )}
    >
      <div className="px-3 max-w-2xl mx-auto">
        {/* Header avec SearchBar */}
        <div className="mb-4 w-full">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            loading={loading}
            placeholder="Rechercher..."
            className="w-full"
            onSearchSubmit={(q) => setQuery(q)}
          />
        </div>

        {/* Contenu principal */}
        {initialLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <Card
                key={index}
                className="border-0 bg-gradient-to-br from-background to-background/50"
              >
                <CardContent className="p-3 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !query && !hasSearched ? (
          renderEmptyState()
        ) : error ? (
          <div className="text-center py-8 space-y-4 px-4">
            <div className="text-destructive text-base font-semibold">
              Erreur de recherche
            </div>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button
              onClick={refresh}
              variant="outline"
              className="h-10 px-4 touch-manipulation"
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <Tabs
            value={currentCategory}
            onValueChange={(value) =>
              handleCategoryChange(value as SearchCategory)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-4 h-auto bg-background/50 backdrop-blur-sm touch-manipulation">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const count = getBadgeCount(key as SearchCategory);
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="relative flex flex-col gap-1 py-2.5 px-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[44px] touch-manipulation"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <info.icon className="w-4 h-4" />
                      <span className="font-medium text-[10px] leading-tight text-center">
                        {info.label}
                      </span>
                    </div>
                    {hasSearched && count > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute z-10 -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 text-[9px] font-bold bg-primary text-primary-foreground border-0"
                      >
                        {count > 99 ? "99+" : count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.keys(CATEGORY_INFO).map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {loading && !results?.length ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Recherche en cours...
                      </span>
                    </div>
                  </div>
                ) : (
                  renderResults()
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-25 pb-[120px]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded mx-auto max-w-lg"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
