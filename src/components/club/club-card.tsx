"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/clubTypes";

type Props = {
  club: Club;
  variant?: "grid" | "list";
};

export const ClubCard = ({ club, variant = "grid" }: Props) => {
  const router = useRouter();

  return (
    <div
      key={club.id}
      onClick={() => router.push(`/clubs/${club.id}`)}
      className={cn(
        "cursor-pointer",
        variant === "grid"
          ? "group bg-background rounded-2xl overflow-hidden"
          : "w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "grid"
            ? "aspect-square rounded-2xl mb-3"
            : "h-12 w-12 rounded-lg"
        )}
      >
        {club.club_picture ? (
          <Image
            src={club.club_picture}
            alt={club.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Contenu */}
      <div
        className={variant === "grid" ? "space-y-1 px-1" : "flex-1 space-y-1"}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium leading-[1.3]">{club.name}</h3>

          {club.type && (
            <Badge 
              variant={club.type === "Private" ? "secondary" : "outline"}
              className={variant === "grid" ? "text-xs" : ""}
            >
              {club.type === "Private" ? "Privé" : "Public"}
            </Badge>
          )}
        </div>

        {variant === "list" && club.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {club.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {club.member_count} membre{club.member_count > 1 ? "s" : ""}
          </span>

          {club.genre && (
            <Badge variant="outline" className="text-xs">
              {club.genre.charAt(0).toUpperCase() + club.genre.slice(1)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
