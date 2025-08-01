"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import {
  recommendationService,
  RecommendedBook,
  RecommendationFeedback,
} from "@/services/recommendation.service";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Star,
  BookOpen,
  RefreshCw,
  TrendingUp,
  Heart,
  Filter,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const FILTER_OPTIONS = {
  all: { label: "Toutes", icon: Sparkles },
  fiction: { label: "Fiction", icon: BookOpen },
  non_fiction: { label: "Non-fiction", icon: TrendingUp },
  romance: { label: "Romance", icon: Heart },
  science_fiction: { label: "Science-fiction", icon: Star },
  mystery: { label: "Mystère", icon: BookOpen },
} as const;

type FilterType = keyof typeof FILTER_OPTIONS;

export default function RecommendationsPage() {
  const router = useRouter();
  const isNative = Capacitor.isNativePlatform();

  // State
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<
    RecommendedBook[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());
  const [dislikedBooks, setDislikedBooks] = useState<Set<string>>(new Set());

  // Load recommendations
  const loadRecommendations = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await recommendationService.getBookRecommendations(50);
      setRecommendations(response.data);
      setFilteredRecommendations(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des recommandations:", error);
      toast.error("Impossible de charger les recommandations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Filter recommendations
  const filterRecommendations = useCallback(
    (filter: FilterType) => {
      if (filter === "all") {
        setFilteredRecommendations(recommendations);
      } else {
        const filtered = recommendations.filter(
          (book) =>
            book.genre?.toLowerCase().includes(filter.replace("_", "-")) ||
            book.genre?.toLowerCase().includes(filter.replace("_", " "))
        );
        setFilteredRecommendations(filtered);
      }
    },
    [recommendations]
  );

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    filterRecommendations(filter);
  };

  // Handle feedback
  const handleRecommendationFeedback = async (
    bookId: string,
    liked: boolean
  ) => {
    try {
      const feedback: RecommendationFeedback = {
        bookId,
        liked,
        reason: liked ? "user_liked" : "user_disliked",
      };

      await recommendationService.sendFeedback(feedback);

      if (liked) {
        setLikedBooks((prev) => new Set(prev).add(bookId));
        setDislikedBooks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
        toast.success("Livre ajouté à vos préférences !");
      } else {
        setDislikedBooks((prev) => new Set(prev).add(bookId));
        setLikedBooks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
        toast.success("Préférence enregistrée");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      toast.error("Impossible d'enregistrer votre préférence");
    }
  };

  // Initialize
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Update filtered results when filter changes
  useEffect(() => {
    filterRecommendations(currentFilter);
  }, [currentFilter, filterRecommendations]);

  // Recommendation Card Component
  const RecommendationCard = ({ book }: { book: RecommendedBook }) => {
    const isLiked = likedBooks.has(book.id);
    const isDisliked = dislikedBooks.has(book.id);

    return (
      <Card
        className="active:scale-95 transition-all duration-150 border-0 bg-gradient-to-br from-background to-background/50 touch-manipulation"
        onClick={() => router.push(`/books/${book.id}`)}
      >
        <CardContent className="p-3">
          <div className="flex gap-3">
            {book.cover_image ? (
              <div className="relative w-16 h-20 shrink-0 rounded-md overflow-hidden shadow-sm">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="w-16 h-20 shrink-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-md flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm leading-tight line-clamp-2">
                  {book.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <span className="text-xs font-medium">
                    {(book.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2 truncate">
                {book.author}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {book.genre && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      {book.genre}
                    </Badge>
                  )}
                  {book.publicationYear && (
                    <span className="text-xs text-muted-foreground">
                      {book.publicationYear}
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant={isLiked ? "default" : "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationFeedback(book.id, true);
                    }}
                    className={cn(
                      "h-7 w-7 p-0 touch-manipulation",
                      isLiked && "bg-green-500 hover:bg-green-600 text-white"
                    )}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={isDisliked ? "default" : "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationFeedback(book.id, false);
                    }}
                    className={cn(
                      "h-7 w-7 p-0 touch-manipulation",
                      isDisliked && "bg-red-500 hover:bg-red-600 text-white"
                    )}
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
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-background/80 pb-[120px]",
        isNative ? "pt-[120px]" : "pt-[100px]"
      )}
    >
      <div className="px-3 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">
              Recommandations personnalisées
            </h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Découvrez des livres sélectionnés pour vous
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadRecommendations(true)}
              disabled={refreshing}
              className="h-9 px-3 touch-manipulation"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {Object.entries(FILTER_OPTIONS).map(([key, option]) => (
                <Button
                  key={key}
                  variant={currentFilter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(key as FilterType)}
                  className="h-8 px-3 shrink-0 touch-manipulation"
                >
                  <option.icon className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                className="border-0 bg-gradient-to-br from-background to-background/50"
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="h-20 w-16 rounded-md bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Aucune recommandation</h3>
              <p className="text-muted-foreground text-sm">
                {currentFilter === "all"
                  ? "Nous n'avons pas encore de recommandations pour vous."
                  : `Aucune recommandation trouvée pour ${FILTER_OPTIONS[currentFilter].label.toLowerCase()}.`}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              {currentFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("all")}
                  className="h-10 px-4 touch-manipulation"
                >
                  Voir toutes les recommandations
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => loadRecommendations(true)}
                className="h-10 px-4 touch-manipulation"
              >
                Actualiser
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredRecommendations.length} livre
                {filteredRecommendations.length > 1 ? "s" : ""} recommandé
                {filteredRecommendations.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ThumbsUp className="h-3 w-3 text-green-500" />
                <span>{likedBooks.size}</span>
                <ThumbsDown className="h-3 w-3 text-red-500" />
                <span>{dislikedBooks.size}</span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-3">
              {filteredRecommendations.map((book) => (
                <RecommendationCard key={book.id} book={book} />
              ))}
            </div>

            {/* Feedback Info */}
            {filteredRecommendations.length > 0 && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">
                    Améliorez vos recommandations
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisez les boutons 👍 et 👎 pour nous aider à mieux
                  comprendre vos goûts et recevoir des recommandations plus
                  précises.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
