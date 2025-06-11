"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search as SearchIcon,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  User,
  BookOpen,
  Users,
  List,
  Users2,
  Loader2,
} from "lucide-react";
import { useInfiniteSearch } from "@/hooks/useAdvancedSearch";
import { SearchCategory } from "@/types/searchTypes";
import { SearchBar } from "@/components/search/search-bar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const TRENDING_SEARCHES = [
  "Harry Potter",
  "Dune",
  "Stephen King",
  "Romance contemporaine",
  "Science-fiction",
  "Fantasy épique",
  "Thriller psychologique",
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
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory =
    (searchParams.get("category") as SearchCategory) || "all";

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

  // Le scroll infini est géré par useInfiniteScroll hook

  // Fonction pour traduire les rôles
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

  // Initialiser depuis les URL params
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
    if (initialCategory !== currentCategory) {
      changeCategory(initialCategory);
    }
  }, [searchParams]);

  // Mettre à jour l'URL
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

  // Calculer les badges (totaux par catégorie)
  const getBadgeCount = (category: SearchCategory) => {
    if (!totals?.getBadgeCount) return 0;
    return totals.getBadgeCount(category);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <SearchIcon className="h-16 w-16 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Découvrez Bookish</h3>
        <p className="text-muted-foreground max-w-md">
          Recherchez des livres, des utilisateurs, des clubs de lecture et des
          listes de livres
        </p>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recherches populaires
          </h4>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => handleTrendingSearch(search)}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Erreur de recherche</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
      <Button onClick={refresh} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    </div>
  );

  const renderNoResults = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <SearchIcon className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Aucun résultat trouvé</h3>
        <p className="text-muted-foreground">
          Aucun résultat pour "{query}" dans{" "}
          {CATEGORY_INFO[currentCategory].label.toLowerCase()}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => changeCategory("all")}
          variant="outline"
          size="sm"
        >
          Rechercher dans tout
        </Button>
        <Button onClick={clearSearch} variant="outline" size="sm">
          Effacer la recherche
        </Button>
      </div>
    </div>
  );

  const renderResultItem = (item: any) => {
    const type = item.type || item.result_type;

    switch (type) {
      case "user":
        return (
          <Card key={item.id} className="p-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {item.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold truncate">{item.username}</h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-auto bg-background"
                  >
                    UTILISATEUR
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {translateRole(item.profile?.role)}
                </p>
                {item.stats && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{item.stats.followers_count} abonnés</span>
                    <span>•</span>
                    <span>{item.stats.books_published} livres</span>
                    {item.search_score && (
                      <>
                        <span>•</span>
                        <span>{item.search_score}% match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );

      case "book":
        return (
          <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-16 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-auto bg-background flex-shrink-0"
                  >
                    LIVRE
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5 h-auto"
                  >
                    AUTEUR
                  </Badge>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.genre}
                  </Badge>
                  {item.publicationYear && (
                    <span className="text-xs text-muted-foreground">
                      📅 {item.publicationYear}
                    </span>
                  )}
                  {item.search_score && (
                    <span className="text-xs text-muted-foreground">
                      • {item.search_score}% match
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );

      case "club":
        return (
          <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-auto bg-background flex-shrink-0"
                  >
                    CLUB
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{item.memberCount || 0} membres</span>
                  {item.genre && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {item.genre}
                      </Badge>
                    </>
                  )}
                  {item.search_score && (
                    <>
                      <span>•</span>
                      <span>{item.search_score}% match</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );

      case "book_list":
      case "bookList":
        return (
          <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <List className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-auto bg-background flex-shrink-0"
                  >
                    LISTE
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{item.bookCount || 0} livres</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 h-auto"
                    >
                      CRÉATEUR
                    </Badge>
                    <span>{item.user?.username || item.creator?.username}</span>
                  </div>
                  {item.visibility && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.visibility}
                      </Badge>
                    </>
                  )}
                  {item.search_score && (
                    <>
                      <span>•</span>
                      <span>{item.search_score}% match</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card key={item.id} className="p-4">
            <div className="text-sm text-muted-foreground">
              Type inconnu: {type}
            </div>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
              {JSON.stringify(item, null, 2)}
            </pre>
          </Card>
        );
    }
  };

  const renderResults = () => {
    if (!results || results.length === 0) {
      return renderNoResults();
    }

    const currentCount = results.length;
    const totalCount = getBadgeCount(currentCategory);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentCount} résultat{currentCount > 1 ? "s" : ""} affiché
            {currentCount > 1 ? "s" : ""}
            {totals && ` sur ${totalCount} trouvé${totalCount > 1 ? "s" : ""}`}
            {totalCount > 100 && (
              <span className="text-xs text-muted-foreground ml-2">
                (maximum 100 affichés)
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-4">{results.map(renderResultItem)}</div>

        {/* Élément observé pour le scroll infini - comme dans le feed */}
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && hasMore && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Chargement... ({currentCount}/100)</span>
            </div>
          )}
          {!hasMore &&
            currentCount > 0 &&
            currentCount >= 100 &&
            totalCount > 100 && (
              <div className="text-sm text-muted-foreground text-center">
                <p>🔍 Limite de 100 résultats atteinte</p>
                <p className="text-xs mt-1">
                  Affinez votre recherche pour des résultats plus précis
                </p>
              </div>
            )}
          {!hasMore && currentCount > 0 && currentCount < 100 && (
            <p className="text-center text-muted-foreground">
              🎉 Tous les résultats ont été chargés !
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-[120px] md:pt-[90px] pb-[120px] md:pb-[90px]">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header avec SearchBar - toujours visible et centré */}
        <div className="mb-8 w-full flex justify-center">
          <div className="w-full max-w-lg">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              suggestions={suggestions}
              loading={loading}
              placeholder="Rechercher dans Bookish..."
              className="w-full"
              onSearchSubmit={(q) => setQuery(q)}
            />
          </div>
        </div>

        {/* Contenu principal */}
        {initialLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-[90%] bg-muted animate-pulse rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : !query && !hasSearched ? (
          renderEmptyState()
        ) : error ? (
          renderErrorState()
        ) : (
          <Tabs
            value={currentCategory}
            onValueChange={(value) =>
              handleCategoryChange(value as SearchCategory)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-6 h-auto">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const count = getBadgeCount(key as SearchCategory);
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="relative flex flex-col gap-1 py-2 px-2 text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <info.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs font-medium">
                        {info.label}
                      </span>
                    </div>
                    {hasSearched && count > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-0.5 -right-0.5 h-4 w-auto min-w-[16px] px-1 py-0 text-[10px] font-medium bg-primary text-primary-foreground"
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
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
        <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
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
