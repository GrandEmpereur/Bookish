"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClubCard, ClubCardSkeleton } from "@/components/club/club-card";
import { clubService } from "@/services/club.service";
import type { Club } from "@/types/clubTypes";
import { Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useAuth } from "@/contexts/auth-context";
import { Capacitor } from "@capacitor/core";

export default function Clubs() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Détection responsive pour le padding-top
  const isNativePlatform = Capacitor.isNativePlatform();
  const topPadding = isNativePlatform ? "pt-[120px]" : "pt-[100px]";

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await clubService.getClubs({ page: 1, perPage: 20 });
        
        if (response.data) {
          // Structure réelle: { data: { clubs: Club[], pagination: {...} } }
          const clubsData = response.data.clubs || [];
          const paginationData = response.data.pagination;
          
          setClubs(clubsData);
          
          if (paginationData && typeof paginationData.has_more !== 'undefined') {
            setHasMore(paginationData.has_more);
          } else {
            setHasMore(false);
          }
          setPage(paginationData?.current_page || 1);
        }
      } catch (err) {
        console.error("Erreur de chargement des clubs :", err);
        toast.error("Impossible de charger les clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const loadMoreClubs = async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const response = await clubService.getClubs({ page: nextPage, perPage: 20 });
      
      if (response.data) {
        // Structure réelle: { data: { clubs: Club[], pagination: {...} } }
        const clubsData = response.data.clubs || [];
        const paginationData = response.data.pagination;
        
        setClubs(prev => [...prev, ...clubsData]);
        
        if (paginationData && typeof paginationData.has_more !== 'undefined') {
          setHasMore(paginationData.has_more);
          setPage(paginationData.current_page || nextPage);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des clubs :", err);
      toast.error("Impossible de charger plus de clubs");
    }
  };

  // Fonction pour filtrer les clubs de l'utilisateur
  const getMyClubs = () => {
    if (!user?.user?.id) return [];
    
    return clubs.filter((club) => {
      // L'utilisateur est membre du club
      const isMember = club.isMember === true;
      
      // L'utilisateur a un rôle dans le club
      const hasRole = club.currentUserRole;
      
      // L'utilisateur est le propriétaire du club
      const isOwner = club.owner?.id === user.user?.id;
      
      return isMember || hasRole || isOwner;
    });
  };

  // Composant ClubGridSkeleton
  const ClubGridSkeleton = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ClubCardSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`flex-1 px-5 ${topPadding} pb-[120px]`}>
      <div className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "all" | "my")}
          className="w-full"
        >
          <TabsList className="w-full flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 gap-6">
            <TabsTrigger
              value="all"
              className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
            >
              Tous les clubs
            </TabsTrigger>
            <TabsTrigger
              value="my"
              className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
            >
              Mes clubs
            </TabsTrigger>
          </TabsList>

          <div className="w-full mt-4">
            <TabsContent value="all" className="w-full">
              {loading ? (
                <ClubGridSkeleton />
              ) : (
                <ClubGrid 
                  clubs={clubs} 
                  hasMore={hasMore}
                  onLoadMore={loadMoreClubs}
                  loading={false}
                />
              )}
            </TabsContent>
            <TabsContent value="my" className="w-full">
              {loading ? (
                <ClubGridSkeleton />
              ) : getMyClubs().length > 0 ? (
                <ClubGrid 
                  clubs={getMyClubs()} 
                  hasMore={false}
                  onLoadMore={() => {}}
                  loading={false}
                />
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-4 text-muted-foreground">
                    Vous n'avez pas encore rejoint de club
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Bouton flottant pour créer un club */}
      <FloatingActionButton
        onClick={() => router.push("/clubs/create")}
        className="bottom-[110px] w-14 h-14"
      />
    </div>
  );
}

interface ClubGridProps {
  clubs: Club[];
  hasMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
}

const ClubGrid = ({ clubs, hasMore, onLoadMore, loading }: ClubGridProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} variant="grid" />
      ))}
    </div>
    
    {hasMore && (
      <div className="text-center py-4">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="px-4 py-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          ) : (
            "Charger plus"
          )}
        </button>
      </div>
    )}
  </div>
);
