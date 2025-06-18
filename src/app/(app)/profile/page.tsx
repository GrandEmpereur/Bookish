//profile/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import BookListCards from "@/components/library/book-list-cards";
import type { Post } from "@/types/postTypes";
import type {
  FriendshipStatus,
  UserProfile,
  UserRelations,
} from "@/types/userTypes";
import {
  Lock,
  BookOpen,
  Book,
  CircleDashed,
  Globe,
  Heart,
  Key,
  MessageSquare,
  MoreVertical,
  Settings,
  ShieldOff,
  Star,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { BookList } from "@/types/bookListTypes";
import { Club } from "@/types/clubTypes";
import { clubService } from "@/services/club.service";

const PIE_COLORS = ["#ec4899", "#dc2626", "#22c55e", "#ffffff"];

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [relations, setRelations] = useState<UserRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus | null>(null);

  // New state for tabs content
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userClubs, setUserClubs] = useState<Club[]>([]);
  const [userReviews, setUserReviews] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [readingStats, setReadingStats] = useState({
    monthlyProgress: [] as { month: string; count: number }[],
    genreDistribution: [] as { name: string; value: number }[],
    topAuthors: [] as { name: string; count: number }[],
    totalBooksRead: 0,
    averageRating: 0,
    readingGoal: {
      current: 0,
      target: 50,
    },
  });

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, relationsResponse] = await Promise.all([
        userService.getAuthenticatedProfile(),
        userService.getRelations(),
      ]);

      // Handle the actual API response structure
      const responseData = profileResponse.data as any;

      // Create a UserProfile-like object from the API response
      const userProfile = {
        id: responseData.user.id,
        username: responseData.user.username,
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

      setProfile(userProfile);
      setRelations(relationsResponse.data);

      setReadingStats({
        monthlyProgress: responseData.stats?.monthly_progress || [],
        genreDistribution: responseData.stats?.genre_distribution || [],
        topAuthors: responseData.stats?.top_authors || [],
        totalBooksRead: responseData.stats?.total_books_read || 0,
        averageRating: responseData.stats?.average_rating || 0,
        readingGoal: {
          current: responseData.stats?.current_reading_goal || 0,
          target: responseData.stats?.target_reading_goal || 50,
        },
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Impossible de charger les données du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookLists = async () => {
    try {
      setIsLoadingLists(true);
      const response = await bookListService.getBookLists();
      setBookLists(response.data);
    } catch (error) {
      console.error("Error fetching book lists:", error);
      toast.error("Impossible de charger vos listes");
    } finally {
      setIsLoadingLists(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await postService.getPosts();

      // Handle the actual API response structure
      const responseData = response.data as any;

      // Check if response has posts (either in data directly or data.posts)
      let postsArray: Post[] = [];
      if (Array.isArray(responseData)) {
        // If data is directly an array of posts
        postsArray = responseData;
      } else if (responseData?.posts && Array.isArray(responseData.posts)) {
        // If data has a posts property
        postsArray = responseData.posts;
      } else {
        console.error("Invalid response structure:", response);
        setUserPosts([]);
        return;
      }

      // Filter posts by current user using post.userId
      const currentUserId = profile?.id;
      const currentUserPosts = postsArray.filter((post: Post) => {
        return post.userId === currentUserId;
      });

      setUserPosts(currentUserPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Impossible de charger vos posts");
      setUserPosts([]); // Ensure we set an empty array on error
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchUserClubs = async () => {
    try {
      setIsLoadingClubs(true);
      const response = await clubService.getClubs();
      // Filter clubs where user is a member (this would need to be handled by the API ideally)
      setUserClubs(response.data.clubs || []);
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      toast.error("Impossible de charger vos clubs");
    } finally {
      setIsLoadingClubs(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await postService.getPosts();

      // Handle the actual API response structure
      const responseData = response.data as any;

      // Check if response has posts (either in data directly or data.posts)
      let postsArray: Post[] = [];
      if (Array.isArray(responseData)) {
        // If data is directly an array of posts
        postsArray = responseData;
      } else if (responseData?.posts && Array.isArray(responseData.posts)) {
        // If data has a posts property
        postsArray = responseData.posts;
      } else {
        console.error("Invalid response structure for reviews:", response);
        setUserReviews([]);
        return;
      }

      // Filter only book review posts by current user
      const reviewPosts = postsArray.filter(
        (post: Post) =>
          post.userId === user?.id && post.subject === "book_review"
      );
      setUserReviews(reviewPosts);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      toast.error("Impossible de charger vos avis");
      setUserReviews([]); // Ensure we set an empty array on error
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchBookLists();
  }, []);

  // Add effect to refresh posts when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      // Refresh posts when the window regains focus (user returns from another tab/page)
      if (userPosts.length > 0) {
        fetchUserPosts();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userPosts.length]);

  // Handle tab changes to fetch data when needed
  const handleTabChange = (value: string) => {
    switch (value) {
      case "listes":
        if (bookLists.length === 0 && !isLoadingLists) {
          fetchBookLists();
        }
        break;
      case "posts":
        // Always refresh posts when posts tab is selected to show new posts
        if (!isLoadingPosts) {
          fetchUserPosts();
        }
        break;
      case "avis":
        if (userReviews.length === 0 && !isLoadingReviews) {
          fetchUserReviews();
        }
        break;
      case "clubs":
        if (userClubs.length === 0 && !isLoadingClubs) {
          fetchUserClubs();
        }
        break;
    }
  };

  const handleFollowUser = async () => {
    try {
      await userService.followUser(profile?.id || "");
      await fetchProfileData();
      toast.success("Vous suivez maintenant cet utilisateur");
    } catch (error) {
      toast.error("Impossible de suivre l'utilisateur");
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await userService.unfollowUser(profile?.id || "");
      await fetchProfileData();
      toast.success("Vous ne suivez plus cet utilisateur");
    } catch (error) {
      toast.error("Impossible de se désabonner");
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await userService.sendFriendRequest(profile?.id || "");
      await fetchProfileData();
      toast.success("Votre demande d'ami a été envoyée");
    } catch (error) {
      toast.error("Impossible d'envoyer la demande d'ami");
    }
  };

  const handleBlockUser = async () => {
    try {
      await userService.blockUser(profile?.id || "");
      await fetchProfileData();
      toast.success("Cet utilisateur a été bloqué");
    } catch (error) {
      toast.error("Impossible de bloquer l'utilisateur");
    }
  };

  const handleUnblockUser = async () => {
    try {
      await userService.unblockUser(profile?.id || "");
      await fetchProfileData();
      toast.success("Cet utilisateur a été débloqué");
    } catch (error) {
      toast.error("Impossible de débloquer l'utilisateur");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await userService.removeFriend(profile?.id || "");
      await fetchProfileData();
      toast.success("Cet utilisateur a été retiré de vos amis");
    } catch (error) {
      toast.error("Impossible de supprimer l'ami");
    }
  };

  const renderBookListSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="h-[120px] w-[80px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPostSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderClubSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLoadingState = () => (
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

  const renderActionButtons = () => {
    // Don't show action buttons if no friendship status (this is your own profile)
    if (!profile || !friendshipStatus) return null;

    return (
      <div className="flex items-center gap-2 mt-4">
        {friendshipStatus.isBlocked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnblockUser}
            className="flex items-center gap-2"
          >
            <ShieldOff className="w-4 h-4" />
            Débloquer
          </Button>
        ) : (
          <>
            {!friendshipStatus.isFriend &&
              !friendshipStatus.hasPendingRequest && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendFriendRequest}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter en ami
                </Button>
              )}
            {friendshipStatus.status !== "following" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFollowUser}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Suivre
              </Button>
            )}
            {friendshipStatus.status === "following" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnfollowUser}
                className="flex items-center gap-2"
              >
                <UserMinus className="w-4 h-4" />
                Ne plus suivre
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {friendshipStatus.isFriend && (
                  <DropdownMenuItem onClick={handleRemoveFriend}>
                    Retirer des amis
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleBlockUser}>
                  Bloquer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
          {renderLoadingState()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
        {/* Header with profile info */}
        <div className="flex items-start space-x-4 mb-2 mt-20">
          <div className="relative">
            <Avatar className="w-16 h-16 border-4 border-[#F3D7D7] bg-[#F3D7D7]">
              <AvatarImage
                src={profile?.profile?.profile_picture_url ?? "/avatar.png"}
                alt={profile?.username ?? undefined}
              />
              <AvatarFallback className="bg-[#F3D7D7]">
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Row 1: Name and settings */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {profile?.username || "Chargement..."}
              </h1>
            </div>

            {/* Row 2: Preferred genres */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1">
                {user?.profile?.preferred_genres?.[0]}
              </span>
              <span className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1">
                {user?.profile?.preferred_genres?.[1]}
              </span>
            </div>

            {/* Row 3: Reading habit badge */}
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

        {/* Description/bio under the header */}
        <p className="text-sm mt-4 text-gray-700 mb-8">
          {profile?.profile?.bio || "Aucune bio disponible"}
        </p>

        {/* Action buttons - only show when viewing another user's profile */}
        {profile?.id !== user?.id && renderActionButtons()}

        {/* Stats counters */}
        <div className="relative w-full max-w-md rounded-xl px-6 py-4 bg-[#2F4739] overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            {/* Column 1: Following */}
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

            {/* Column 2: Followers */}
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

            {/* Column 3: Points */}
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

        {/* Tabs navigation - styled to match the image */}
        <div className="mt-6">
          <Tabs
            defaultValue="Suivi"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <div className="w-full">
              <TabsList className="flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 px-5 gap-6">
                <TabsTrigger
                  value="Suivi"
                  className="border-b-2 border-b-[#416E54] px-0 pb-2 pt-0 text-[15px] text-[#416E54] font-medium rounded-none bg-transparent h-auto data-[state=active]:shadow-none data-[state=inactive]:border-b-transparent data-[state=inactive]:text-gray-500"
                >
                  Suivi
                </TabsTrigger>
                <TabsTrigger
                  value="listes"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Listes
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="avis"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Avis
                </TabsTrigger>
                <TabsTrigger
                  value="clubs"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Clubs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="w-full mt-4">
              <TabsContent value="Suivi" className="w-full space-y-6 mt-0">
                <div className="relative rounded-xl overflow-hidden bg-[#2F4739] p-6">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-10 -left-0 h-40 w-40 bg-white/10 rounded-full" />

                  {/* Card title */}
                  <h2 className="relative text-white text-xl font-semibold mb-6 text-center">
                    Résumé de lecture
                  </h2>

                  {/* Stats cards */}
                  <div className="relative grid grid-cols-3 gap-4">
                    {/* Genre le plus lus */}
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <div className="flex justify-center w-full">
                        <Heart className="h-4 w-4 text-white" fill="white" />
                      </div>
                      <span className="text-[#2F4739] text-[9px] text-center font-semibold leading-tight px-1">
                        Genre le plus lu
                      </span>
                      <span className="text-[#ffffff] text-sm font-semibold text-center leading-tight">
                        {readingStats.genreDistribution[0]?.name || "Aucun"}
                      </span>
                      <div className="text-[#2F4739] text-[10px] text-center font-bold leading-tight">
                        <div>Depuis le début</div>
                        <div>de l'année</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <div className="flex justify-center w-full">
                        <div className="bg-[#F3D7D7] rounded-full p-1 h-5 w-5 flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
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

                    {/* Note moyenne */}
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-4 h-[140px] justify-between">
                      <div className="flex justify-center w-full">
                        <Star className="h-4 w-4 text-white" fill="white" />
                      </div>
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
                </div>

                {/* Monthly reading progress */}
                <div
                  className="rounded-lg p-6 mb-8 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    {readingStats.totalBooksRead}
                  </div>
                  <div className="text-md text-white/90 mb-4">
                    Livres lus depuis le début de l’année
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
                </div>

                {/* Genre pie chart */}
                <div
                  className="rounded-lg p-6 mb-8 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Genre le plus lus depuis le début de l'année:{" "}
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
                        <Legend
                          wrapperStyle={{
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Most read authors */}
                <div
                  className="rounded-lg p-6 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <h2 className="text-lg font-semibold mb-4 text-white">
                    Auteurs les plus lus depuis le début de l'année
                  </h2>

                  {readingStats.topAuthors.map((author, index) => (
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
                </div>
              </TabsContent>

              <TabsContent value="listes" className="w-full">
                <div className="space-y-6">
                  <BookListCards
                    bookLists={bookLists}
                    isLoadingLists={isLoadingLists}
                  />
                </div>
              </TabsContent>

              <TabsContent value="posts" className="w-full">
                <div className="space-y-4">
                  {isLoadingPosts ? (
                    renderPostSkeleton()
                  ) : userPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-4 text-muted-foreground">
                        Vous n'avez pas encore publié de posts
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/feed/create")}
                      >
                        Créer un post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.map((post) => (
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
                                <span className="font-medium">
                                  {post.user?.username}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    {
                                      addSuffix: true,
                                      locale: fr,
                                    }
                                  )}
                                </span>
                              </div>
                              <h3 className="text-sm text-muted-foreground">
                                {post.title}
                              </h3>
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
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="avis" className="w-full">
                <div className="space-y-4">
                  {isLoadingReviews ? (
                    renderPostSkeleton()
                  ) : userReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-4 text-muted-foreground">
                        Vous n'avez pas encore écrit d'avis
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/library")}
                      >
                        Découvrir des livres
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <button
                          key={review.id}
                          onClick={() => router.push(`/feed/${review.id}`)}
                          className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
                        >
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {review.user?.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {review.user?.username}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(review.createdAt),
                                    {
                                      addSuffix: true,
                                      locale: fr,
                                    }
                                  )}
                                </span>
                              </div>
                              <h3 className="text-sm text-muted-foreground">
                                {review.title}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                Critique de livre
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">{review.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{review.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{review.commentsCount}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="clubs" className="w-full">
                <div className="space-y-4">
                  {isLoadingClubs ? (
                    renderClubSkeleton()
                  ) : userClubs.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-4 text-muted-foreground">
                        Vous ne faites partie d'aucun club
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/clubs")}
                      >
                        Découvrir des clubs
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userClubs.map((club) => (
                        <button
                          key={club.id}
                          onClick={() => router.push(`/clubs/${club.id}`)}
                          className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                              {club.club_picture ? (
                                <Image
                                  src={club.club_picture}
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
                                  variant={
                                    club.type === "Private"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {club.type === "Private" ? "Privé" : "Public"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {club.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {club.member_count} membre
                                  {club.member_count > 1 ? "s" : ""}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {club.genre}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
