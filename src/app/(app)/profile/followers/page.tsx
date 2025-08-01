"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BookUser } from "lucide-react";
import { toast } from "sonner";

interface Follower {
  id: string;
  username: string;
  profile: {
    firstName: string | null;
    lastName: string | null;
    profilePictureUrl: string | null;
  } | null;
}

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await userService.getRelations();

      // Récupère la liste et le count
      const data = response.data.followers;
      setFollowers(Array.isArray(data.list) ? data.list : []);
      setFollowersCount(typeof data.count === "number" ? data.count : 0);
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Impossible de charger vos followers");
      setFollowers([]);
      setFollowersCount(0);
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
        {/* Stats */}
        {!loading && followersCount > 0 && (
          <div className="p-4 rounded-lg">
            <p className="text-center text-sm text-muted-foreground">
              {followersCount} follower{followersCount > 1 ? "s" : ""}
            </p>
          </div>
        )}
        {loading ? (
          renderLoadingSkeleton()
        ) : followers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100dvh-230px)] text-center">
            <BookUser className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">
              Vous n'avez pas encore de followers.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {followers.map((follower) => (
              <button
                key={follower.id}
                onClick={() => handleUserClick(follower.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={follower.profile?.profilePictureUrl || undefined}
                    alt={follower.username}
                  />
                  <AvatarFallback>
                    {follower.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <span className="font-medium">{follower.username}</span>
                  {follower.profile?.firstName &&
                    follower.profile?.lastName && (
                      <p className="text-sm text-muted-foreground">
                        {follower.profile.firstName} {follower.profile.lastName}
                      </p>
                    )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
