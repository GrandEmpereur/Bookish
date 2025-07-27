"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/club/club-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { bookListService } from "@/services/book-list.service";
import { userService } from "@/services/user.service";
import { postService } from "@/services/post.service";
import { clubService } from "@/services/club.service";
import { statisticsService } from "@/services/statistics.service";
import BookListCards from "@/components/library/book-list-cards";
import type { Post } from "@/types/postTypes";
import type { UserProfile, UserRelations } from "@/types/userTypes";
import type { BookList } from "@/types/bookListTypes";
import type { Club } from "@/types/clubTypes";
import type { ReadingStatistics } from "@/types/statisticsTypes";
import BookListSkeleton from "@/components/library/book-list-skeleton";
import {
  BookOpen,
  CircleDashed,
  Globe,
  Heart,
  Key,
  MessageSquare,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { AchievementsShowcase } from "@/components/ui/achievements-showcase";
import { getAllBadgeDefinitions } from "@/utils/badgeSystem";
import { safeFormatDistanceToNow } from "@/lib/date";

const PIE_COLORS = ["#ec4899", "#dc2626", "#22c55e", "#ffffff"];

interface ProfileData {
  profile: UserProfile | null;
  relations: UserRelations | null;
  readingStats: ReadingStatistics | null;
  legacyStats: {
    monthlyProgress: { month: string; count: number }[];
    genreDistribution: { name: string; value: number }[];
    topAuthors: { name: string; count: number }[];
    totalBooksRead: number;
    averageRating: number;
    readingGoal: { current: number; target: number };
  };
}

interface TabData {
  bookLists: BookList[];
  userPosts: Post[];
  userClubs: Club[];
  userReviews: Post[];
}

interface LoadingStates {
  profile: boolean;
  bookLists: boolean;
  posts: boolean;
  clubs: boolean;
  reviews: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  // Consolidated state
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: null,
    relations: null,
    readingStats: null,
    legacyStats: {
      monthlyProgress: [],
      genreDistribution: [],
      topAuthors: [],
      totalBooksRead: 0,
      averageRating: 0,
      readingGoal: { current: 0, target: 50 },
    },
  });

  const [tabData, setTabData] = useState<TabData>({
    bookLists: [],
    userPosts: [],
    userClubs: [],
    userReviews: [],
  });

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    profile: true,
    bookLists: false,
    posts: false,
    clubs: false,
    reviews: false,
  });

  const [activeTab, setActiveTab] = useState("Suivi");
  const [profileRetryCount, setProfileRetryCount] = useState(0);

  // Memoized values
  const isOwnProfile = useMemo(
    () => profileData.profile?.id === user?.id,
    [profileData.profile?.id, user?.id]
  );

  const defaultGenres = useMemo(
    () => user?.profile?.preferred_genres?.slice(0, 2) || [],
    [user?.profile?.preferred_genres]
  );

  // Optimized data fetchers
  const fetchProfileData = useCallback(async () => {
    if (profileRetryCount >= 3) {
      console.warn("Max profile retry attempts reached");
      setLoadingStates((prev) => ({ ...prev, profile: false }));
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, profile: true }));

      const [profileResponse, relationsResponse, statsResponse] =
        await Promise.all([
          userService.getAuthenticatedProfile(),
          userService.getRelations(),
          statisticsService.getReadingStatistics().catch((error) => {
            console.error("Erreur lors du chargement des statistiques:", error);
            return { status: "success", data: null };
          }),
        ]);

      const responseData = profileResponse.data as any;

      const userProfile: UserProfile = {
        id: responseData.user.id,
        username: responseData.user.username,
        requesterUsername: responseData.user.username, // L'utilisateur consulte son propre profil
        email: responseData.user.email,
        created_at: responseData.user.created_at,
        is_verified: responseData.user.is_verified,
        profile: {
          id: responseData.profile.id,
          first_name: responseData.profile.firstName,
          last_name: responseData.profile.lastName,
          birth_date: responseData.profile.birthDate,
          bio: responseData.profile.bio,
          profile_picture_url: responseData.profile.profile_picture_url,
          role: responseData.profile.role,
          reading_habit: responseData.profile.readingHabit,
          usage_purpose: responseData.profile.usagePurpose,
          preferred_genres: responseData.profile.preferredGenres,
          profile_visibility: responseData.profile.profileVisibility,
          allow_follow_requests: responseData.profile.allowFollowRequests,
          email_notifications: responseData.profile.emailNotifications,
          push_notifications: responseData.profile.pushNotifications,
          newsletter_subscribed: responseData.profile.newsletterSubscribed,
        },
        stats: responseData.stats,
      };

      // Debug: Vérifier les données extraites
      console.log("Reading Stats Data:", statsResponse.data);

      setProfileData((prev) => ({
        ...prev,
        profile: userProfile,
        relations: relationsResponse.data,
        readingStats: statsResponse?.data || null,
        legacyStats: {
          monthlyProgress: responseData.stats?.monthly_progress || [],
          genreDistribution: responseData.stats?.genre_distribution || [],
          topAuthors: responseData.stats?.top_authors || [],
          totalBooksRead: responseData.stats?.total_books_read || 0,
          averageRating: responseData.stats?.average_rating || 0,
          readingGoal: {
            current: responseData.stats?.current_reading_goal || 0,
            target: responseData.stats?.target_reading_goal || 50,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileRetryCount((prev) => prev + 1);
      toast.error("Impossible de charger les données du profil");
    } finally {
      setLoadingStates((prev) => ({ ...prev, profile: false }));
    }
  }, [profileRetryCount]);

  const fetchBookLists = useCallback(async () => {
    if (tabData.bookLists.length > 0) return;

    try {
      setLoadingStates((prev) => ({ ...prev, bookLists: true }));
      const response = await bookListService.getBookLists();
      setTabData((prev) => ({ ...prev, bookLists: response.data }));
    } catch (error) {
      console.error("Error fetching book lists:", error);
      toast.error("Impossible de charger vos listes");
    } finally {
      setLoadingStates((prev) => ({ ...prev, bookLists: false }));
    }
  }, [tabData.bookLists.length]);

  const fetchUserPosts = useCallback(async () => {
    if (!profileData.profile?.id) return;

    try {
      setLoadingStates((prev) => ({ ...prev, posts: true }));
      const response = await postService.getPosts();
      const responseData = response.data as any;

      let postsArray: Post[] = [];
      if (Array.isArray(responseData)) {
        postsArray = responseData;
      } else if (responseData?.posts && Array.isArray(responseData.posts)) {
        postsArray = responseData.posts;
      }

      const userPosts = postsArray.filter(
        (post) => post.userId === profileData.profile?.id
      );
      setTabData((prev) => ({ ...prev, userPosts }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Impossible de charger vos posts");
    } finally {
      setLoadingStates((prev) => ({ ...prev, posts: false }));
    }
  }, [profileData.profile?.id]);

  const fetchUserClubs = useCallback(async () => {
    if (tabData.userClubs.length > 0) return;

    try {
      setLoadingStates((prev) => ({ ...prev, clubs: true }));
      const response = await clubService.getClubs();
      const memberClubs = (response.data.clubs || []).filter(
        (club) => club.isMember
      );
      setTabData((prev) => ({ ...prev, userClubs: memberClubs }));
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      toast.error("Impossible de charger vos clubs");
    } finally {
      setLoadingStates((prev) => ({ ...prev, clubs: false }));
    }
  }, [tabData.userClubs.length]);

  const fetchUserReviews = useCallback(async () => {
    if (!profileData.profile?.id || tabData.userReviews.length > 0) return;

    try {
      setLoadingStates((prev) => ({ ...prev, reviews: true }));
      const response = await postService.getPosts();
      const responseData = response.data as any;

      let postsArray: Post[] = [];
      if (Array.isArray(responseData)) {
        postsArray = responseData;
      } else if (responseData?.posts && Array.isArray(responseData.posts)) {
        postsArray = responseData.posts;
      }

      const reviewPosts = postsArray.filter(
        (post) =>
          post.userId === profileData.profile?.id &&
          post.subject === "book_review"
      );
      setTabData((prev) => ({ ...prev, userReviews: reviewPosts }));
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      toast.error("Impossible de charger vos avis");
    } finally {
      setLoadingStates((prev) => ({ ...prev, reviews: false }));
    }
  }, [profileData.profile?.id, tabData.userReviews.length]);

  // Tab change handler
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);

      switch (value) {
        case "listes":
          fetchBookLists();
          break;
        case "posts":
          fetchUserPosts();
          break;
        case "avis":
          fetchUserReviews();
          break;
        case "clubs":
          fetchUserClubs();
          break;
      }
    },
    [fetchBookLists, fetchUserPosts, fetchUserReviews, fetchUserClubs]
  );

  // Effects
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Render helpers
  const renderSkeleton = useCallback((type: "post" | "club" | "general") => {
    const skeletonCount = 3;

    if (type === "general") {
      return (
        <div className="space-y-4 pt-20">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <div className="flex gap-3">
              <Skeleton
                className={
                  type === "club"
                    ? "h-12 w-12 rounded-lg"
                    : "h-10 w-10 rounded-full"
                }
              />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                {type === "club" && <Skeleton className="h-4 w-24" />}
              </div>
            </div>
            {type === "post" && <Skeleton className="h-16 w-full" />}
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }, []);

  const renderEmptyState = useCallback(
    (type: "posts" | "reviews" | "clubs" | "listes", action: () => void) => {
      const configs = {
        posts: {
          icon: MessageSquare,
          message: "Vous n'avez pas encore publié de posts",
          buttonText: "Créer un post",
        },
        reviews: {
          icon: Star,
          message: "Vous n'avez pas encore écrit d'avis",
          buttonText: "Découvrir des livres",
        },
        clubs: {
          icon: Users,
          message: "Vous ne faites partie d'aucun club",
          buttonText: "Découvrir des clubs",
        },
        listes: {
          icon: BookOpen,
          message: "Vous n'avez encore créé aucune liste",
          buttonText: "Créer une liste",
        },
      };

      const config = configs[type];
      const Icon = config.icon;

      return (
        <div className="text-center py-4">
          <Icon className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">{config.message}</p>
          <Button variant="outline" className="mt-4" onClick={action}>
            {config.buttonText}
          </Button>
        </div>
      );
    },
    []
  );

  const renderPostCard = useCallback(
    (post: Post, isReview = false) => (
      <button
        key={post.id}
        onClick={() => router.push(`/feed/${post.id}`)}
        className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
      >
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {post.user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{post.user?.username}</span>
              <span className="text-sm text-muted-foreground">
                {safeFormatDistanceToNow(post.createdAt, true)}
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground">{post.title}</h3>
            {isReview && (
              <Badge variant="secondary" className="mt-1">
                Critique de livre
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm">{post.content}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{post.likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
      </button>
    ),
    [router]
  );

  const renderClubCard = useCallback(
    (club: Club) => (
      <button
        key={club.id}
        onClick={() => router.push(`/clubs/${club.id}`)}
        className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
      >
        <div className="flex gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg">
            {club.cover_image ? (
              <Image
                src={club.cover_image}
                alt={club.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{club.name}</h3>
              <Badge
                variant={club.type === "Private" ? "secondary" : "outline"}
              >
                {club.type === "Private" ? "Privé" : "Public"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {club.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {club.member_count} membre{club.member_count > 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {club.genre}
              </Badge>
            </div>
          </div>
        </div>
      </button>
    ),
    [router]
  );

  // Loading state
  if (loadingStates.profile) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
          {renderSkeleton("general")}
        </main>
      </div>
    );
  }

  const { profile, relations, readingStats, legacyStats } = profileData;

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-2 mt-20">
          <Avatar className="w-16 h-16 border-4 border-[#F3D7D7] bg-[#F3D7D7]">
            <AvatarImage
              src={profile?.profile?.profile_picture_url ?? "/avatar.png"}
              alt={profile?.username}
            />
            <AvatarFallback className="bg-[#F3D7D7]">
              {profile?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold">
              {profile?.username || "Chargement..."}
            </h1>

            <div className="flex items-center space-x-2 mt-2">
              {defaultGenres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 flex items-center space-x-1">
                <Key className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {profile?.profile?.reading_habit || "Lecteur"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm mt-4 text-gray-700 mb-6">
          {profile?.profile?.bio || "Aucune bio disponible"}
        </p>

        {/* Gamification Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/profile/gamification")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Accéder à la Gamification
          </Button>
        </div>

        {/* Stats */}
        <div className="relative w-full max-w-md rounded-xl px-6 py-4 bg-[#2F4739] overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <button
              className="flex flex-col items-center hover:bg-white/10 rounded-lg p-2 transition-colors flex-1"
              onClick={() => router.push("/profile/following")}
            >
              <CircleDashed
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Following
              </span>
              <span className="text-xl font-bold text-white/90">
                {relations?.following?.count || 0}
              </span>
            </button>

            <div className="h-8 w-px bg-white/30" />

            <button
              className="flex flex-col items-center hover:bg-white/10 rounded-lg p-2 transition-colors flex-1"
              onClick={() => router.push("/profile/followers")}
            >
              <Globe
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Followers
              </span>
              <span className="text-xl font-bold text-white/90">
                {relations?.followers?.count || 0}
              </span>
            </button>

            <div className="h-8 w-px bg-white/30" />

            <div className="flex flex-col items-center p-2 flex-1">
              <Star
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Points
              </span>
              <span className="text-xl font-bold text-white/90">
                {profile?.stats?.followers_count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 gap-6">
              {["Suivi", "listes", "posts", "avis", "clubs"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none "
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="w-full mt-4">
              <TabsContent value="Suivi" className="w-full space-y-6 mt-0">
                {/* Reading Summary */}
                <Card className="rounded-xl overflow-hidden bg-[#2F4739] p-6 relative">
                  <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-10 -left-0 h-40 w-40 bg-white/10 rounded-full" />

                  <h2 className="relative text-white text-xl font-semibold mb-6 text-center">
                    Résumé de lecture
                  </h2>

                  <div className="relative grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <Heart className="h-4 w-4 text-white" fill="white" />
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Livres lus
                      </span>
                      <span className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats?.summary?.total_books_read || 0}
                      </span>
                      <div className="text-[#2F4739] text-[10px] text-center font-bold leading-tight">
                        <div>Au total</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <div className="bg-[#F3D7D7] rounded-full p-1 h-5 w-5 flex items-center justify-center">
                        <BookOpen className="w-3 h-3" />
                      </div>
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Pages lues
                      </span>
                      <div className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats?.summary?.total_pages_read || 0}
                      </div>
                      <span className="text-[#2F4739] text-[14px] font-bold text-center leading-tight">
                        Pages
                      </span>
                    </div>

                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <Star className="h-4 w-4 text-white" fill="white" />
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Temps de lecture
                      </span>
                      <span className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {Math.round(
                          (readingStats?.behavioral_analytics?.overview
                            ?.total_reading_time ||
                            readingStats?.summary?.total_reading_time ||
                            0) / 60
                        )}
                        h
                      </span>
                      <span className="text-[#2F4739] text-[14px] font-bold text-center leading-tight">
                        Total
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Performance Level */}
                <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">
                      {readingStats?.summary?.performance_level}
                    </div>
                    <div className="text-md text-white/90 mb-4">
                      Votre niveau de lecture
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {readingStats?.summary?.reading_score || 0}
                        </div>
                        <div className="text-xs text-white/70">
                          Score de lecture
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {readingStats?.summary?.current_streak || 0}
                        </div>
                        <div className="text-xs text-white/70">
                          Jours consécutifs
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {readingStats?.summary?.consistency_score || 0}%
                        </div>
                        <div className="text-xs text-white/70">Régularité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {readingStats?.summary?.reading_efficiency || 0}%
                        </div>
                        <div className="text-xs text-white/70">Efficacité</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Comparison with Other Users */}
                {readingStats?.comparison_report &&
                  readingStats.comparison_report.total_users > 0 && (
                    <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                      <h2 className="text-lg font-semibold mb-4 text-white">
                        Votre position parmi les lecteurs
                      </h2>
                      <div className="space-y-3">
                        <div className="flex justify-between text-white">
                          <span>Classement:</span>
                          <span className="font-semibold">
                            #{readingStats.comparison_report.user_rank} sur{" "}
                            {readingStats.comparison_report.total_users}
                          </span>
                        </div>
                        <div className="flex justify-between text-white">
                          <span>Percentile:</span>
                          <span className="font-semibold">
                            {readingStats.comparison_report.percentile}%
                          </span>
                        </div>
                        <div className="flex justify-between text-white">
                          <span>Meilleur que:</span>
                          <span className="font-semibold">
                            {readingStats.comparison_report.better_than_percent}
                            % des utilisateurs
                          </span>
                        </div>
                        <div className="relative w-full bg-white/20 h-3 rounded-full mt-4">
                          <div
                            className="bg-white absolute top-0 left-0 h-3 rounded-full"
                            style={{
                              width: `${readingStats.comparison_report.percentile}%`,
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                {/* Monthly Trends */}
                {readingStats?.trends_analysis &&
                  readingStats.trends_analysis.periods.length > 0 && (
                    <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                      <h2 className="text-lg font-semibold mb-4 text-white">
                        Tendances de lecture (6 derniers mois)
                      </h2>
                      <div className="space-y-4">
                        {/* Books Read Trend */}
                        <div>
                          <div className="flex justify-between text-sm text-white mb-2">
                            <span>Livres lus par mois</span>
                            <span
                              className={`font-semibold ${
                                readingStats.trends_analysis.growth_rates
                                  .books_read >= 0
                                  ? "text-green-300"
                                  : "text-red-300"
                              }`}
                            >
                              {readingStats.trends_analysis.growth_rates
                                .books_read > 0
                                ? "+"
                                : ""}
                              {
                                readingStats.trends_analysis.growth_rates
                                  .books_read
                              }
                              %
                            </span>
                          </div>
                          <div className="flex items-end space-x-1 h-20">
                            {readingStats.trends_analysis.trends.books_read.map(
                              (count, index) => {
                                const maxValue =
                                  Math.max(
                                    ...readingStats.trends_analysis.trends
                                      .books_read
                                  ) || 1;
                                const height =
                                  count > 0 ? (count / maxValue) * 100 : 5;
                                return (
                                  <div
                                    key={index}
                                    className="flex-1 flex flex-col items-center"
                                  >
                                    <div
                                      className="bg-white/60 w-full rounded-t-sm"
                                      style={{ height: `${height}%` }}
                                    />
                                    <div className="text-xs text-white/70 mt-1">
                                      {readingStats.trends_analysis.periods[
                                        index
                                      ]?.split("-")[1] || ""}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Pages Read Trend */}
                        <div>
                          <div className="flex justify-between text-sm text-white mb-2">
                            <span>Pages lues par mois</span>
                            <span
                              className={`font-semibold ${
                                readingStats.trends_analysis.growth_rates
                                  .pages_read >= 0
                                  ? "text-green-300"
                                  : "text-red-300"
                              }`}
                            >
                              {readingStats.trends_analysis.growth_rates
                                .pages_read > 0
                                ? "+"
                                : ""}
                              {
                                readingStats.trends_analysis.growth_rates
                                  .pages_read
                              }
                              %
                            </span>
                          </div>
                          <div className="flex items-end space-x-1 h-16">
                            {readingStats.trends_analysis.trends.pages_read.map(
                              (count, index) => {
                                const maxValue =
                                  Math.max(
                                    ...readingStats.trends_analysis.trends
                                      .pages_read
                                  ) || 1;
                                const height =
                                  count > 0 ? (count / maxValue) * 100 : 5;
                                return (
                                  <div key={index} className="flex-1">
                                    <div
                                      className="bg-white/40 w-full rounded-t-sm"
                                      style={{ height: `${height}%` }}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                {/* Behavioral Analytics */}
                {readingStats?.behavioral_analytics && (
                  <>
                    {/* Reading Insights */}
                    <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                      <h2 className="text-lg font-semibold mb-4 text-white">
                        Analyse comportementale
                      </h2>
                      <div className="space-y-4">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-white text-lg font-semibold">
                              {
                                readingStats.behavioral_analytics.overview
                                  .total_books_completed
                              }
                            </div>
                            <div className="text-white/70 text-sm">
                              Livres terminés
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-white text-lg font-semibold">
                              {Math.round(
                                readingStats.behavioral_analytics.overview
                                  .average_reading_speed
                              )}{" "}
                              p/min
                            </div>
                            <div className="text-white/70 text-sm">
                              Vitesse moyenne
                            </div>
                          </div>
                        </div>

                        {/* Reading Pattern */}
                        <div className="bg-white/10 rounded-lg p-4">
                          <h3 className="text-white font-medium mb-2">
                            Habitudes de lecture
                          </h3>
                          <div className="space-y-2 text-sm text-white/80">
                            <div>
                              <span className="font-medium">
                                Heure préférée:
                              </span>{" "}
                              {
                                readingStats.behavioral_analytics.insights
                                  .most_active_hour
                              }
                              h00
                            </div>
                            <div>
                              <span className="font-medium">
                                Durée moyenne:
                              </span>{" "}
                              {
                                readingStats.behavioral_analytics.insights
                                  .reading_pattern.averageSessionDuration
                              }{" "}
                              minutes
                            </div>
                            <div>
                              <span className="font-medium">
                                Session la plus longue:
                              </span>{" "}
                              {
                                readingStats.behavioral_analytics.insights
                                  .longest_session
                              }{" "}
                              minutes
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">Régularité:</span>
                              <div className="ml-2 flex-1 bg-white/20 h-2 rounded-full">
                                <div
                                  className="bg-white h-2 rounded-full"
                                  style={{
                                    width: `${readingStats.behavioral_analytics.insights.reading_consistency.score}%`,
                                  }}
                                />
                              </div>
                              <span className="ml-2 text-xs">
                                {
                                  readingStats.behavioral_analytics.insights
                                    .reading_consistency.score
                                }
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Preferred Hours Visualization */}
                        {readingStats.behavioral_analytics.insights
                          .reading_pattern.preferredHours.length > 0 && (
                          <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-3">
                              Heures de lecture préférées
                            </h3>
                            <div className="flex items-end space-x-1 h-16">
                              {Array.from({ length: 24 }, (_, hour) => {
                                const isPreferred =
                                  readingStats.behavioral_analytics.insights.reading_pattern.preferredHours.includes(
                                    hour
                                  );
                                const height = isPreferred ? 100 : 20;
                                return (
                                  <div
                                    key={hour}
                                    className="flex-1 flex flex-col items-center"
                                  >
                                    <div
                                      className={`w-full rounded-t-sm ${
                                        isPreferred ? "bg-white" : "bg-white/30"
                                      }`}
                                      style={{ height: `${height}%` }}
                                    />
                                    {hour % 6 === 0 && (
                                      <div className="text-xs text-white/60 mt-1">
                                        {hour}h
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Recommendations */}
                    {readingStats.behavioral_analytics.recommendations.length >
                      0 && (
                      <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                        <h2 className="text-lg font-semibold mb-4 text-white">
                          Recommandations personnalisées
                        </h2>
                        <div className="space-y-3">
                          {readingStats.behavioral_analytics.recommendations.map(
                            (recommendation, index) => (
                              <div
                                key={index}
                                className="bg-white/10 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-white font-medium">
                                    {recommendation.title}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      recommendation.priority === "high"
                                        ? "bg-red-500/20 text-red-200"
                                        : recommendation.priority === "medium"
                                          ? "bg-yellow-500/20 text-yellow-200"
                                          : "bg-green-500/20 text-green-200"
                                    }`}
                                  >
                                    {recommendation.priority === "high"
                                      ? "Priorité haute"
                                      : recommendation.priority === "medium"
                                        ? "Priorité moyenne"
                                        : "Priorité basse"}
                                  </span>
                                </div>
                                <p className="text-white/80 text-sm mb-2">
                                  {recommendation.description}
                                </p>
                                <div className="text-white/60 text-xs">
                                  <span className="font-medium">
                                    Impact attendu:
                                  </span>{" "}
                                  {recommendation.expected_impact}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {/* Genre Distribution */}
                {legacyStats.genreDistribution.length > 0 && (
                  <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                      Genre le plus lus depuis le début de l&apos;année:{" "}
                      <span className="font-bold">
                        {legacyStats.genreDistribution[0]?.name || "Aucun"}
                      </span>
                    </h2>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={legacyStats.genreDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {legacyStats.genreDistribution.map(
                              (entry: any, index: number) => (
                                <Cell
                                  key={`slice-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#333",
                              border: "none",
                              borderRadius: "4px",
                            }}
                            labelStyle={{ color: "#fff" }}
                            itemStyle={{ color: "#fff" }}
                          />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}

                {/* Top Authors */}
                {legacyStats.topAuthors.length > 0 && (
                  <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                    <h2 className="text-lg font-semibold mb-4 text-white">
                      Auteurs les plus lus depuis le début de l&apos;année
                    </h2>
                    {legacyStats.topAuthors.map((author: any) => (
                      <div key={author.name}>
                        <div className="flex justify-between text-sm text-white">
                          <span>{author.name}</span>
                          <span>{author.count} livres</span>
                        </div>
                        <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
                          <div
                            className="bg-white absolute top-0 left-0 h-2 rounded-full"
                            style={{
                              width: `${(author.count / legacyStats.topAuthors[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="listes" className="w-full">
                {loadingStates.bookLists ? (
                  <BookListSkeleton />
                ) : tabData.bookLists.length === 0 ? (
                  renderEmptyState("listes", () =>
                    router.push("/library/create")
                  )
                ) : (
                  <BookListCards
                    bookLists={tabData.bookLists}
                    isLoadingLists={false}
                  />
                )}
              </TabsContent>

              <TabsContent value="avis" className="w-full">
                {loadingStates.reviews ? (
                  renderSkeleton("post")
                ) : tabData.userReviews.length === 0 ? (
                  renderEmptyState("reviews", () => router.push("/library"))
                ) : (
                  <div className="space-y-4">
                    {tabData.userReviews.map((review) =>
                      renderPostCard(review, true)
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="clubs" className="w-full">
                {loadingStates.clubs ? (
                  renderSkeleton("club")
                ) : tabData.userClubs.length === 0 ? (
                  renderEmptyState("clubs", () => router.push("/clubs"))
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {tabData.userClubs.map((club) => (
                      <ClubCard key={club.id} club={club} variant="grid" />
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
