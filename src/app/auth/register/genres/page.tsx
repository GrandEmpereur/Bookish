"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RegisterStepThreeRequest } from "@/types/authTypes";
import { toast } from "sonner";

const genres: Array<{
  id: string;
  label: string;
}> = [
  { id: "fantasy", label: "Fantasy" },
  { id: "sci-fi", label: "Science Fiction" },
  { id: "romance", label: "Romance" },
  { id: "thriller", label: "Thriller" },
  { id: "mystery", label: "Mystère" },
  { id: "horror", label: "Horreur" },
  { id: "historical", label: "Historique" },
  { id: "contemporary", label: "Contemporain" },
  { id: "literary", label: "Littérature" },
  { id: "non-fiction", label: "Non-Fiction" },
  { id: "biography", label: "Biographie" },
  { id: "self-help", label: "Développement Personnel" },
];

export default function Genres() {
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { completeStepThree } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.replace("/auth/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const toggleGenre = (genreId: string) => {
    setPreferredGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (preferredGenres.length === 0) {
      toast.error("Veuillez sélectionner au moins un genre");
      return;
    }

    try {
      setIsLoading(true);
      const data: RegisterStepThreeRequest = {
        email,
        preferredGenres: preferredGenres,
      };

      await completeStepThree(data);

      // Nettoyage et redirection vers le feed
      sessionStorage.removeItem("verificationEmail");
      router.replace("/feed");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col px-5 bg-background pt-[60px]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center items-center">
        <h1 className="text-2xl font-heading mb-2 text-center">
          Vos genres préférés
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Sélectionnez les genres qui vous intéressent
        </p>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {genres.map((genre) => (
            <Badge
              key={genre.id}
              variant={
                preferredGenres.includes(genre.id) ? "default" : "outline"
              }
              className={`cursor-pointer text-sm py-2 px-4
                                ${
                                  preferredGenres.includes(genre.id)
                                    ? "bg-primary hover:bg-primary/90"
                                    : "hover:bg-accent"
                                }
                                ${
                                  isLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
                            `}
              onClick={() => !isLoading && toggleGenre(genre.id)}
            >
              {genre.label}
            </Badge>
          ))}
        </div>

        <Button
          className="w-full h-14 bg-primary-800 hover:bg-primary-900 text-white"
          onClick={handleSubmit}
          disabled={preferredGenres.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalisation...
            </>
          ) : (
            "Terminer l'inscription"
          )}
        </Button>
      </div>
    </div>
  );
}
