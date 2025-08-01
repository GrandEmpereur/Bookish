"use client";

import Image from "next/image";
import Link from "next/link";
import { Ad } from "@/types/adTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";

interface AdCardProps {
  ad: Ad;
}

// Carte publicitaire inspirée du style Instagram
export function AdCard({ ad }: AdCardProps) {
  return (
    <article className="bg-card rounded-lg shadow-xs my-4 border border-muted-foreground/10">
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">Bookish Ads</span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              Contenu sponsorisé
            </span>
          </div>
        </div>
      </div>

      {/* Media */}
      <Link href={ad.targetUrl} target="_blank" className="block w-full">
        <div className="relative aspect-square md:aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={ad.mediaUrl}
            alt={ad.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Pied */}
      <div className="px-4 py-3 space-y-2">
        <Link
          href={ad.targetUrl}
          target="_blank"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          En savoir plus
        </Link>
      </div>
    </article>
  );
}
