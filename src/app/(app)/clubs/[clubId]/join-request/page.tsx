"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { clubService } from "@/services/club.service";
import { Club } from "@/types/clubTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Users, MessageSquare, Lock } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const JoinRequestPage = () => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.clubId as string;
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const response = await clubService.getClub(clubId);
        if (response.data) {
          setClub(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du club:", error);
        toast.error("Impossible de charger les informations du club");
        router.push("/clubs");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClub();
    }
  }, [clubId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Veuillez ajouter un message de présentation");
      return;
    }

    if (!user?.user?.id) {
      toast.error("Vous devez être connecté pour faire une demande");
      return;
    }

    setSubmitting(true);
    try {
      await clubService.createJoinRequest(clubId, {
        message: message.trim(),
      });

      toast.success("Demande envoyée avec succès !");
      router.push(`/clubs/${clubId}`);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast.error(error.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 px-5 pt-25 pb-[120px]">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex-1 px-5 pt-25 pb-[120px]">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Club introuvable</p>
        </div>
      </div>
    );
  }

  // Vérifier si le club est privé
  if (club.type !== "Private") {
    return (
      <div className="flex-1 px-5 pt-25 pb-[120px]">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">Club public</h2>
              <p className="text-muted-foreground mb-4">
                Ce club est public, vous pouvez le rejoindre directement sans
                demande.
              </p>
              <Button
                onClick={() => router.push(`/clubs/${clubId}`)}
                className="rounded-full"
              >
                Aller au club
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-5 pt-25 pb-[120px]">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Club Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Image du club */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {club.club_picture ? (
                  <Image
                    src={club.club_picture}
                    alt={club.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary-500" />
                  </div>
                )}
              </div>

              {/* Infos du club */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-bold">{club.name}</h1>
                  <Badge variant="outline" className="gap-1">
                    <Lock className="w-3 h-3" />
                    Privé
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-3">
                  {club.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {club.member_count} membre{club.member_count > 1 ? "s" : ""}
                  </div>
                  {club.genre && (
                    <Badge variant="secondary" className="text-xs">
                      {club.genre}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de demande */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Demande d'adhésion
            </CardTitle>
            <CardDescription>
              Ce club est privé. Présentez-vous et expliquez pourquoi vous
              souhaitez rejoindre ce club.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message de présentation *</Label>
                <Textarea
                  id="message"
                  placeholder="Bonjour ! Je suis passionné(e) de [genre] et j'aimerais rejoindre votre club car..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="text-xs text-muted-foreground text-right">
                  {message.length}/500 caractères
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/clubs/${clubId}`)}
                  disabled={submitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>

                <Button
                  type="submit"
                  className="flex-1 rounded-full"
                  disabled={submitting || !message.trim()}
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi...
                    </div>
                  ) : (
                    "Envoyer la demande"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info sur le processus */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">📋 Processus de validation :</p>
              <ul className="space-y-1 ml-4">
                <li>
                  • Votre demande sera examinée par les modérateurs du club
                </li>
                <li>
                  • Vous recevrez une notification une fois la demande traitée
                </li>
                <li>
                  • En cas d'acceptation, vous pourrez accéder au contenu du
                  club
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinRequestPage;
