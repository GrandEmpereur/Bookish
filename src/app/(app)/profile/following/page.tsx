"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookUser } from "lucide-react";
import { toast } from "sonner";

interface Following {
  id: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
  } | null;
}

export default function FollowingPage() {
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await userService.getRelations();

      // Ensure we have a valid array
      const followingList = response.data?.following?.list;

      if (Array.isArray(followingList)) {
        setFollowing(
          followingList.map((user: any) => ({
            id: user.id,
            username: user.username,
            profile: user.profile
              ? {
                  firstName: user.profile.firstName ?? "",
                  lastName: user.profile.lastName ?? "",
                  profilePictureUrl: user.profile.profilePictureUrl ?? null,
                }
              : null,
          }))
        );
      } else {
        setFollowing([]);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Impossible de charger votre liste de suivi");
      setFollowing([]); // Ensure we set an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto px-5 pb-[120px] max-w-md pt-25">
        {/* Content */}
        {loading ? (
          renderLoadingSkeleton()
        ) : following.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100dvh-230px)] text-center">
            <BookUser className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">
              Vous ne suivez personne pour le moment.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/search")}
            >
              Découvrir des utilisateurs
            </Button>
          </div>
        ) : (
          <div>
            {/* Stats */}
            {!loading && following.length > 0 && (
              <div className="p-4 rounded-lg">
                <p className="text-center text-sm text-muted-foreground">
                  Vous suivez {following.length} personne
                  {following.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
            <div className="space-y-2">
              {Array.isArray(following) &&
                following.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.profile?.profilePictureUrl || undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.username}</span>
                      </div>
                      {user.profile?.firstName && user.profile?.lastName && (
                        <p className="text-sm text-muted-foreground">
                          {user.profile.firstName} {user.profile.lastName}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
