"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { cn } from "@/lib/utils";
import { ClubCard } from "@/components/club/club-card";
import { clubService } from "@/services/club.service";
import type { Club } from "@/types/clubTypes";

export default function Clubs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await clubService.getClubs();
        setClubs(res.data.clubs); // ✅ assure-toi que "clubs" est bien dans res.data
      } catch (err) {
        console.error("Erreur de chargement des clubs :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <>
      <div className="flex-1 px-5 pb-[120px] pt-[120px]">
        <div className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "all" | "my")}
            className="w-full"
          >
            <TabsList className="flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0  gap-6">
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
                <ClubGrid clubs={clubs} />
              </TabsContent>
              <TabsContent value="my" className="w-full">
                {clubs.filter((c) => c.isMember).length > 0 ? (
                  <ClubGrid clubs={clubs.filter((c) => c.isMember)} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Vous n'avez pas encore rejoint de club
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <FloatingActionButton
        onClick={() => router.push("/clubs/create")}
        className="bottom-[110px] w-14 h-14"
      />
    </>
  );
}

const ClubGrid = ({ clubs }: { clubs: Club[] }) => (
  <div className="grid grid-cols-2 gap-4">
    {clubs.map((club) => (
      <ClubCard key={club.id} club={club} variant="grid" />
    ))}
  </div>
);
