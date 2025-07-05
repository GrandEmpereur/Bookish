"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CircleDashed, Globe, Heart, Key, Star, Users } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GetUserProfileResponse } from "@/types/userTypes";
import { userService } from "@/services/user.service";

const PIE_COLORS = ["#F3D7D7", "#C5CFC9", "#9FB8AD", "#6DA37F", "#416E54"];

export default function UserDetails() {
  const { userId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<GetUserProfileResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile(userId as string);
      setData(response);
    } catch (e) {
      toast.error("Impossible de charger le profil utilisateur");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading || !data) {
    return (
      <main className="container pt-12 px-5 max-w-md">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-8" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </main>
    );
  }

  const { profile } = data.data;

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-2 mt-20">
          <Avatar className="w-16 h-16 border-4 border-[#F3D7D7] bg-[#F3D7D7]">
          <AvatarImage
            src={profile.profilePicturePath ?? "/avatar.png"}
            alt={profile.firstName || "Profil"}
          />
          <AvatarFallback>
            {profile.firstName?.[0] || profile.role?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-xl font-bold">{data.data.user.username  || profile.role}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {profile.preferredGenres?.slice(0, 2).map((genre, i) => (
              <span key={i} className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1">
                {genre}
              </span>
            ))}
            <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-medium">
              {profile.readingHabit}
            </div>
          </div>
            <p className="text-sm text-muted-foreground">{profile.bio || "Aucune bio disponible"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative w-full rounded-xl px-6 py-4 bg-[#2F4739] overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex flex-col items-center flex-1">
            <CircleDashed className="w-5 h-5 text-white/80" />
            <span className="text-xs text-white/70">Suivis</span>
            <span className="text-white font-bold">
              {data.data.stats?.following_count || 0}
            </span>
          </div>
          <div className="h-8 w-px bg-white/30" />
          <div className="flex flex-col items-center flex-1">
            <Globe className="w-5 h-5 text-white/80" />
            <span className="text-xs text-white/70">Abonnés</span>
            <span className="text-white font-bold">
              {data.data.stats?.followers_count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="flex justify-center gap-4">
          <TabsTrigger value="overview">Résumé</TabsTrigger>
          <TabsTrigger value="reading">Lecture</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mt-4 p-4">
            <h2 className="font-semibold mb-2">Rôle</h2>
            <p>{profile.role}</p>
          </Card>
        </TabsContent>

        <TabsContent value="reading">
          <Card className="mt-4 p-4">
            <h2 className="font-semibold mb-2">Préférences de lecture</h2>
            <ul className="list-disc list-inside text-sm">
              <li>Habitude : {profile.readingHabit}</li>
              <li>Objectif : {profile.usagePurpose}</li>
              <li>Genres préférés : {profile.preferredGenres.join(", ") || "aucun"}</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
    </div>
  );
}
