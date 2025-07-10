"use client";

import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Lock, Globe, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MOCK_CLUBS } from "@/config/mock-data";

type TabType = "all" | "my";

export default function Clubs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Filtrer les clubs selon le tab actif
  const displayedClubs =
    activeTab === "all"
      ? MOCK_CLUBS
      : MOCK_CLUBS.filter((club) => club.isMember);

  const ClubGrid = ({ clubs }: { clubs: typeof MOCK_CLUBS }) => (
    <div className="grid grid-cols-2 gap-4">
      {clubs.map((club) => (
        <div
          key={club.id}
          className="group cursor-pointer bg-background rounded-2xl overflow-hidden"
          onClick={() => router.push(`/clubs/${club.id}`)}
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl mb-3">
            <Image
              src={club.coverImage}
              alt={club.name}
              fill
              draggable="false"
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={false}
            />
          </div>

          {/* Contenu */}
          <div className="space-y-1 px-1">
            {/* Titre */}
            <h3 className="text-xl font-semibold">{club.name}</h3>

            {/* Modérateur */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-sm">Modéré par</span>
              <span className="text-muted-foreground text-sm">
                {club.moderator.username}
              </span>
            </div>

            {/* Membres */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Users className="w-4 h-4" />
                {club.memberCount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex-1 px-5 pb-[120px] pt-[120px]">
        <div className="space-y-6">
          {/* Tabs en haut */}
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "pb-2 transition-colors",
                activeTab === "all"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              Tous les clubs
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={cn(
                "pb-2 transition-colors",
                activeTab === "my"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              Mes clubs
            </button>
          </div>

          {/* Affichage conditionnel selon le tab actif */}
          {displayedClubs.length > 0 ? (
            <ClubGrid clubs={displayedClubs} />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {activeTab === "my"
                ? "Vous n'avez pas encore rejoint de club"
                : "Aucun club disponible"}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton
        onClick={() => router.push("/clubs/create")}
        className="bottom-[110px] w-14 h-14"
      />
    </>
  );
}
