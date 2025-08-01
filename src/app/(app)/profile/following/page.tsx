"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookUser, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserRelations {
  friends: {
    count: number;
    list: Array<{
      id: string;
      username: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
        fullName: string;
        profilePictureUrl: string | null;
      } | null;
    }>;
  };
}

export default function FollowingPage() {
  const [friends, setFriends] = useState<UserRelations["friends"]["list"]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRelations();
  }, []);

  const fetchRelations = async () => {
    try {
      setLoading(true);
      const response = await userService.getRelations();
      const friendsList = response.data?.friends?.list;

      if (Array.isArray(friendsList)) {
        setFriends(friendsList);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Impossible de charger la liste de vos amis");
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (userId: string) => {
    try {
      await userService.removeFriend(userId);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== userId)
      );
      toast.success("Ami supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ami:", error);
      toast.error("Impossible de supprimer cet ami");
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
        {loading ? (
          renderLoadingSkeleton()
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100dvh-230px)] text-center">
            <BookUser className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">
              Vous n'avez aucun ami pour le moment.
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
            {!loading && friends.length > 0 && (
              <div className="p-4 rounded-lg">
                <p className="text-center text-sm text-muted-foreground">
                  Vous avez {friends.length} ami{friends.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
            <div className="space-y-2">
              {friends.map((user) => (
                <div
                  key={user.id}
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
                  <div
                    className="flex-1 text-left"
                    onClick={() => handleUserClick}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.username}</span>
                    </div>
                    {user.profile?.firstName && user.profile?.lastName && (
                      <p className="text-sm text-muted-foreground">
                        {user.profile.firstName} {user.profile.lastName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    className="ml-4 h-8 w-8 flex items-center justify-center"
                    onClick={() => removeFriend(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
