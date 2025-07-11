//profile/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/club/club-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { bookListService } from "@/services/book-list.service";
import { userService } from "@/services/user.service";
import { postService } from "@/services/post.service";
import { clubService } from "@/services/club.service";
import BookListCards from "@/components/library/book-list-cards";
import type { Post } from "@/types/postTypes";
import type { UserProfile, UserRelations } from "@/types/userTypes";
import type { BookList } from "@/types/bookListTypes";
import type { Club } from "@/types/clubTypes";
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

const PIE_COLORS = ["#ec4899", "#dc2626", "#22c55e", "#ffffff"];

interface ProfileData {
  profile: UserProfile | null;
  relations: UserRelations | null;
  readingStats: {
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
    readingStats: {
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

      const [profileResponse, relationsResponse] = await Promise.all([
        userService.getAuthenticatedProfile(),
        userService.getRelations(),
      ]);

      const responseData = profileResponse.data as any;

      const userProfile: UserProfile = {
        id: responseData.user.id,
        username: responseData.user.username,
        email: responseData.user.email,
        created_at: responseData.user.created_at,
        requesterUsername: responseData.user.username,
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

      setProfileData((prev) => ({
        ...prev,
        profile: userProfile,
        relations: relationsResponse.data,
        readingStats: {
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
      setTabData((prev) => ({ ...prev, userClubs: response.data.clubs || [] }));
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
        <div className="space-y-4">
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
    (type: "posts" | "reviews" | "clubs", action: () => void) => {
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
      };

      const config = configs[type];
      const Icon = config.icon;

      return (
        <div className="text-center py-8">
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
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
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

  // const renderClubCard = useCallback(
  //   (club: Club) => (
  //     <button
  //       key={club.id}
  //       onClick={() => router.push(`/clubs/${club.id}`)}
  //       className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
  //     >
  //       <div className="flex gap-3">
  //         <div className="relative h-12 w-12 overflow-hidden rounded-lg">
  //           {club.club_picture ? (
  //             <Image
  //               src={club.club_picture}
  //               alt={club.name}
  //               fill
  //               className="object-cover"
  //             />
  //           ) : (
  //             <div className="w-full h-full bg-muted flex items-center justify-center">
  //               <Users className="h-6 w-6 text-muted-foreground" />
  //             </div>
  //           )}
  //         </div>
  //         <div className="flex-1">
  //           <div className="flex items-center justify-between">
  //             <h3 className="font-medium">{club.name}</h3>
  //             <Badge
  //               variant={club.type === "Private" ? "secondary" : "outline"}
  //             >
  //               {club.type === "Private" ? "Privé" : "Public"}
  //             </Badge>
  //           </div>
  //           <p className="text-sm text-muted-foreground line-clamp-2">
  //             {club.description}
  //           </p>
  //           <div className="flex items-center gap-2 mt-2">
  //             <Badge variant="outline" className="text-xs">
  //               {club.member_count} membre{club.member_count > 1 ? "s" : ""}
  //             </Badge>
  //             <Badge variant="outline" className="text-xs">
  //               {club.genre}
  //             </Badge>
  //           </div>
  //         </div>
  //       </div>
  //     </button>
  //   ),
  //   [router]
  // );

  function mapToUnifiedClub(club: any): Club {
    return {
      ...club,
      coverImage: club.coverImage || club.club_picture,
      memberCount: club.memberCount ?? club.member_count ?? 0,
    };
  }

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

  const { profile, relations, readingStats } = profileData;

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
                {relations?.following?.length || 0}
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
                {relations?.followers?.length || 0}
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
            <TabsList className="flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 px-5 gap-6">
              {["Suivi", "listes", "posts", "avis", "clubs"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
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
                        Genre le plus lu
                      </span>
                      <span className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats.genreDistribution[0]?.name || "Aucun"}
                      </span>
                      <div className="text-[#2F4739] text-[10px] text-center font-bold leading-tight">
                        <div>Depuis le début</div>
                        <div>de l&apos;année</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <div className="bg-[#F3D7D7] rounded-full p-1 h-5 w-5 flex items-center justify-center">
                        <BookOpen className="w-3 h-3" />
                      </div>
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Objectif {new Date().getFullYear()}
                      </span>
                      <div className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats.readingGoal.current} sur{" "}
                        {readingStats.readingGoal.target}
                      </div>
                      <span className="text-[#2F4739] text-[14px] font-bold text-center leading-tight">
                        Livres
                      </span>
                    </div>

                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <Star className="h-4 w-4 text-white" fill="white" />
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Note moyenne de vos avis
                      </span>
                      <span className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-[#2F4739] text-[14px] font-bold text-center leading-tight">
                        Étoiles
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Monthly Progress */}
                <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                  <div className="text-4xl font-bold text-white mb-1">
                    {readingStats.totalBooksRead}
                  </div>
                  <div className="text-md text-white/90 mb-4">
                    Livres lus depuis le début de l&apos;année
                  </div>
                  <div className="space-y-3">
                    {readingStats.monthlyProgress.map(({ month, count }) => (
                      <div key={month} className="flex items-center gap-3">
                        <div className="w-10 text-sm font-medium text-white/90">
                          {month}
                        </div>
                        <div className="flex-1 bg-white/10 h-6 rounded-md relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-6 bg-white/40"
                            style={{
                              width: `${(count / readingStats.readingGoal.target) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Genre Distribution */}
                {readingStats.genreDistribution.length > 0 && (
                  <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                      Genre le plus lus depuis le début de l&apos;année:{" "}
                      <span className="font-bold">
                        {readingStats.genreDistribution[0]?.name || "Aucun"}
                      </span>
                    </h2>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={readingStats.genreDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {readingStats.genreDistribution.map(
                              (entry, index) => (
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
                {readingStats.topAuthors.length > 0 && (
                  <Card className="rounded-lg p-6 bg-gradient-to-r from-[#6DA37F] to-[#416E54]">
                    <h2 className="text-lg font-semibold mb-4 text-white">
                      Auteurs les plus lus depuis le début de l&apos;année
                    </h2>
                    {readingStats.topAuthors.map((author) => (
                      <div key={author.name}>
                        <div className="flex justify-between text-sm text-white">
                          <span>{author.name}</span>
                          <span>{author.count} livres</span>
                        </div>
                        <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
                          <div
                            className="bg-white absolute top-0 left-0 h-2 rounded-full"
                            style={{
                              width: `${(author.count / readingStats.topAuthors[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="listes" className="w-full">
                <BookListCards
                  bookLists={tabData.bookLists}
                  isLoadingLists={loadingStates.bookLists}
                />
              </TabsContent>

              <TabsContent value="posts" className="w-full">
                {loadingStates.posts ? (
                  renderSkeleton("post")
                ) : tabData.userPosts.length === 0 ? (
                  renderEmptyState("posts", () => router.push("/feed/create"))
                ) : (
                  <div className="space-y-4">
                    {tabData.userPosts.map((post) => renderPostCard(post))}
                  </div>
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

              {/* <TabsContent value="clubs" className="w-full">
                {loadingStates.clubs ? (
                  renderSkeleton("club")
                ) : tabData.userClubs.length === 0 ? (
                  renderEmptyState("clubs", () => router.push("/clubs"))
                ) : (
                  <div className="space-y-4">
                    {tabData.userClubs.map((club) => renderClubCard(club))}
                  </div>
                )}
              </TabsContent> */}

              <TabsContent value="clubs" className="w-full">
                {loadingStates.clubs ? (
                  renderSkeleton("club")
                ) : tabData.userClubs.length === 0 ? (
                  renderEmptyState("clubs", () => router.push("/clubs"))
                ) : (
                  <div className="space-y-4">
                    {tabData.userClubs.map((club) => (
                      <div className="grid grid-cols-2 gap-4">
                        <ClubCard key={club.id} club={club} variant="grid" />
                      </div>
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
