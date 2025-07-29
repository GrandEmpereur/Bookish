"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { reviewService } from "@/services/review.service";
import { toast } from "sonner";
import type { Review } from "@/types/reviewTypes";

import { Trash2 } from "lucide-react";

interface Props {
  bookId: string;
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
  onReviewAdded: () => void;
  currentUserId: string;
}

export function ReviewPopover({
  bookId,
  reviews,
  averageRating,
  totalReviews,
  onReviewAdded,
  currentUserId,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState("");

  const hasUserAlreadyReviewed = reviews.some(
    (review) => review.user.id === currentUserId
  );

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Merci de sélectionner une note.");
      return;
    }
    try {
      setIsSending(true);
      await reviewService.createReview({
        bookId: bookId,
        rating: rating,
        title: title || "Avis",
        content: comment,
        spoilerWarning: false,
      });

      toast.success("Merci pour votre avis !");
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          <span
            className={`underline text-sm ${
              averageRating ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            {averageRating ? `${averageRating.toFixed(1)}` : "Aucun avis"}
          </span>

          {totalReviews > 0 && (
            <span className="text-sm text-muted-foreground">
              ({totalReviews} avis)
            </span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogTitle className="text-lg font-bold">
          Laissez votre avis
        </DialogTitle>
        <div className="flex flex-col gap-2">
          {hasUserAlreadyReviewed ? (
            <p className="text-sm text-muted-foreground">
              Vous avez déjà publié un avis.
            </p>
          ) : (
            <>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const isFull = rating >= n;
                  const isHalf = rating >= n - 0.5 && rating < n;

                  return (
                    <div key={n} className="relative w-6 h-6">
                      {/* Zone cliquable gauche (moitié gauche = n - 0.5) */}
                      <div
                        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                        onClick={() => setRating(n - 0.5)}
                      />

                      {/* Zone cliquable droite (moitié droite = n) */}
                      <div
                        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                        onClick={() => setRating(n)}
                      />

                      {/* Visuel étoile */}
                      <Star
                        className="w-full h-full text-[#facc15]"
                        fill={
                          isFull
                            ? "#facc15"
                            : isHalf
                              ? "url(#halfGradient)"
                              : "none"
                        }
                        stroke="currentColor"
                        color={isFull || isHalf ? "#facc15" : "#d1d5db"} // yellow-400 ou gray-300
                      />
                    </div>
                  );
                })}

                {/* Dégradé SVG pour demi-étoile */}
                <svg width="0" height="0">
                  <linearGradient id="halfGradient">
                    <stop offset="50%" stopColor="#facc15" />
                    <stop
                      offset="50%"
                      stopColor="transparent"
                      stopOpacity="1"
                    />
                  </linearGradient>
                </svg>
              </div>

              <Input
                placeholder="Titre de votre avis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
              />
              <Textarea
                placeholder="Commentaire"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button onClick={submitReview}>
                {isSending ? "Envoi..." : "Envoyer"}
              </Button>
            </>
          )}
        </div>

        <hr className="my-1" />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-lg font-bold">
              Avis existants
            </DialogTitle>

            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Aucun avis pour le moment.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-accent-200 p-3 rounded text-sm space-y-1"
                  >
                    {/* Ligne avatar / username / bouton supprimer */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {review.user.profile.profile_picture_path ? (
                          <img
                            src={review.user.profile.profile_picture_path}
                            alt="avatar"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {review.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold">
                          {review.user.username}
                        </span>
                      </div>

                      {review.user.id === currentUserId && (
                        <Trash2
                          className="h-4 w-4 text-destructive cursor-pointer"
                          onClick={async () => {
                            try {
                              await reviewService.deleteReview(review.id);
                              toast.success("Avis supprimé");
                              onReviewAdded();
                            } catch (err) {
                              toast.error("Erreur lors de la suppression");
                            }
                          }}
                        />
                      )}
                    </div>

                    {/* Titre + note */}
                    {review.title && (
                      <div className="flex items-center gap-2">
                        <p className="font-medium leading-snug">
                          {review.title}
                        </p>
                        <span className="text-yellow-500">
                          {review.rating} ★
                        </span>
                      </div>
                    )}

                    {/* Contenu de l'avis */}
                    {review.content && (
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
