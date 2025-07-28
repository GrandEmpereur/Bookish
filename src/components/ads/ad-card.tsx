import Image from "next/image";
import Link from "next/link";
import { Ad } from "@/types/adTypes";

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-xs my-4">
      <Link href={ad.targetUrl} target="_blank" className="block space-y-3">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={ad.mediaUrl}
            alt={ad.title}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-medium text-base md:text-lg text-center">
          {ad.title}
        </h3>
      </Link>
    </div>
  );
} 