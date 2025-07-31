"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/clubTypes";

type Props = {
  club: Club;
  variant?: "grid" | "list";
};

export const ClubCard = ({ club, variant = "grid" }: Props) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Composant pour l'image de substitution
  const ClubPlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="text-center space-y-2">
        <BookOpen className="h-8 w-8 text-blue-500 mx-auto" />
        <div className="text-xs text-blue-600 font-medium">Club</div>
      </div>
    </div>
  );

  // Fonction pour obtenir l'icône du genre
  const getGenreIcon = (genre: string | null) => {
    if (!genre) return BookOpen;
    
    switch (genre.toLowerCase()) {
      case 'fantasy': return BookOpen;
      case 'mystery': return BookOpen;
      case 'romance': return BookOpen;
      case 'thriller': return BookOpen;
      case 'historical': return BookOpen;
      case 'contemporary': return BookOpen;
      case 'literary': return BookOpen;
      case 'manga': return BookOpen;
      default: return BookOpen;
    }
  };

  const GenreIcon = getGenreIcon(club.genre);

  return (
    <div
      key={club.id}
      onClick={() => router.push(`/clubs/${club.id}`)}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        variant === "grid"
          ? "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100"
          : "w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "grid"
            ? "aspect-square rounded-t-2xl"
            : "h-12 w-12 rounded-lg"
        )}
      >
        {club.club_picture && !imageError ? (
          <Image
            src={club.club_picture}
            alt={club.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <ClubPlaceholder />
        )}
        
        {/* Badge de visibilité en overlay */}
        <div className="absolute top-2 right-2">
          <Badge 
            className={cn(
              "text-xs shadow-sm backdrop-blur-sm border-0",
              club.type === "Private" 
                ? "text-white" 
                : "text-white"
            )}
            style={{
              backgroundColor: club.type === "Private" 
                ? "var(--error)" 
                : "var(--success)"
            }}
          >
            {club.type === "Private" ? (
              <><Lock className="w-3 h-3 mr-1" /> Privé</>
            ) : (
              <><Globe className="w-3 h-3 mr-1" /> Public</>
            )}
          </Badge>
        </div>
      </div>

      {/* Contenu */}
      <div
        className={variant === "grid" ? "space-y-2 p-3" : "flex-1 space-y-1"}
      >
        {/* Titre du club */}
        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-sm">
          {club.name}
        </h3>

        {variant === "list" && club.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {club.description}
          </p>
        )}

        {/* Informations du club */}
        <div className="space-y-2">
          {/* Nombre de membres */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Users className="w-3 h-3" />
            <span className="font-medium">{club.member_count}</span>
            <span>membre{club.member_count > 1 ? "s" : ""}</span>
          </div>

          {/* Genre du club */}
          {club.genre && (
            <div className="flex items-center gap-1">
              <Badge 
                variant="outline" 
                className="text-xs border-0"
                style={{
                  backgroundColor: "var(--primary-100)",
                  color: "var(--primary-700)"
                }}
              >
                <GenreIcon className="w-3 h-3 mr-1" />
                {club.genre.charAt(0).toUpperCase() + club.genre.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant skeleton pour les clubs
export const ClubCardSkeleton = ({ variant = "grid" }: { variant?: "grid" | "list" }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        variant === "grid" 
          ? "aspect-[4/5] h-full" 
          : "h-32 flex"
      )}
    >
      {variant === "grid" ? (
        <>
          {/* Image skeleton */}
          <div className="relative h-2/3 w-full">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Content skeleton */}
          <div className="p-3 h-1/3 flex flex-col justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full">
          {/* Image skeleton */}
          <div className="w-24 h-full">
            <Skeleton className="w-full h-full" />
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 p-3 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
