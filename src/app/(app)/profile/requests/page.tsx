"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { clubService } from "@/services/club.service";
import { JoinRequest } from "@/types/clubTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const MyRequestsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        // Note: Cette méthode doit être ajoutée au service si elle n'existe pas
        const response = await clubService.getMyJoinRequests({
          page: 1,
          perPage: 50,
        });
        if (response.data) {
          setRequests(response.data.data || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error);
        toast.error("Impossible de charger vos demandes");
      } finally {
        setLoading(false);
      }
    };

    if (user?.user?.id) {
      fetchMyRequests();
    }
  }, [user?.user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-warning-300" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success-200" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-error-200" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      default:
        return status;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
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

  return (
    <div className="flex-1 px-5 pt-25 pb-[120px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Mes demandes d'adhésion</h1>
          <p className="text-muted-foreground">
            Suivez l'état de vos demandes d'adhésion aux clubs privés
          </p>
        </div>

        {/* Liste des demandes */}
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez fait aucune demande d'adhésion à des clubs privés.
              </p>
              <Button
                onClick={() => router.push("/clubs")}
                className="rounded-full"
              >
                Découvrir les clubs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Image du club */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {request.club.club_picture ? (
                        <Image
                          src={request.club.club_picture}
                          alt={request.club.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-500" />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {request.club.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.club.description}
                          </p>
                        </div>

                        <Badge
                          variant={getStatusVariant(request.status)}
                          className="gap-1 ml-4"
                        >
                          {getStatusIcon(request.status)}
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>

                      {/* Message de la demande */}
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium mb-1">
                          Votre message :
                        </p>
                        <p className="text-sm text-muted-foreground">
                          "{request.message}"
                        </p>
                      </div>

                      {/* Message de review si rejeté ou approuvé */}
                      {request.reviewMessage &&
                        request.status !== "pending" && (
                          <div
                            className={`p-3 rounded-lg mb-3 ${
                              request.status === "approved"
                                ? "bg-success-100 border border-success-200"
                                : "bg-error-100 border border-error-200"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              Réponse des modérateurs :
                            </p>
                            <p className="text-sm">"{request.reviewMessage}"</p>
                          </div>
                        )}

                      {/* Informations sur les dates */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Demandé le{" "}
                          {new Date(request.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>

                        {request.reviewedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {request.status === "approved"
                              ? "Approuvé"
                              : "Rejeté"}{" "}
                            le{" "}
                            {new Date(request.reviewedAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/clubs/${request.club.id}`)
                          }
                        >
                          Voir le club
                        </Button>

                        {request.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(`/clubs/${request.club.id}`)
                            }
                            className="rounded-full"
                            style={{
                              backgroundColor: "var(--success-200)",
                              color: "var(--success-foreground)",
                            }}
                          >
                            Accéder au club
                          </Button>
                        )}

                        {request.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/clubs/${request.club.id}/join-request`
                              )
                            }
                          >
                            Faire une nouvelle demande
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
