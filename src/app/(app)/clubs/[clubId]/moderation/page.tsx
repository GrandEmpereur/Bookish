"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { clubService } from "@/services/club.service";
import { userService } from "@/services/user.service";
import { Club, JoinRequest, Report, ClubMember } from "@/types/clubTypes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Loader2, 
  Check, 
  X, 
  Shield, 
  Users, 
  AlertTriangle, 
  MessageSquare,
  ArrowLeft,
  UserMinus
} from "lucide-react";
import { toast } from "sonner";

const ClubModerationPage = () => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.clubId as string;
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  // États pour les modals et actions
  const [reviewMessage, setReviewMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);

  // Vérifier les permissions de modération
  const canModerate = user?.user?.id === club?.owner?.id; // Simplification : seul le owner peut modérer

  useEffect(() => {
    const fetchModerationData = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les détails du club
        const clubResponse = await clubService.getClub(clubId);
        if (clubResponse.data) {
          setClub(clubResponse.data);
        }

        // 2. Récupérer les demandes de join (si club privé)
        if (clubResponse.data?.type === "Private") {
          const requestsResponse = await clubService.getJoinRequests(clubId, { 
            status: "pending", 
            page: 1, 
            perPage: 50 
          });
          if (requestsResponse.data) {
            setJoinRequests(requestsResponse.data.data || []);
          }
        }

        // 3. Récupérer les signalements en attente
        const reportsResponse = await clubService.getReports(clubId, { 
          status: "pending", 
          page: 1, 
          perPage: 50 
        });
        if (reportsResponse.data) {
          setReports(reportsResponse.data.data || []);
        }

        // 4. Récupérer les membres
        const membersResponse = await clubService.getMembers(clubId, { 
          page: 1, 
          perPage: 100 
        });
        if (membersResponse.data) {
          setMembers(membersResponse.data.members || []);
        }

      } catch (error) {
        console.error("Erreur lors du chargement des données de modération:", error);
        toast.error("Impossible de charger les données de modération");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchModerationData();
    }
  }, [clubId]);

  const handleJoinRequestAction = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessing(true);
    try {
      await clubService.reviewJoinRequest(clubId, selectedRequest.id, {
        action: actionType,
        reviewMessage: reviewMessage.trim() || undefined
      });

      // Retirer la demande de la liste
      setJoinRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      
      toast.success(
        actionType === "approve" 
          ? "Demande approuvée avec succès" 
          : "Demande rejetée"
      );

      // Reset
      setSelectedRequest(null);
      setActionType(null);
      setReviewMessage("");
    } catch (error: any) {
      console.error("Erreur lors du traitement de la demande:", error);
      toast.error(error.message || "Erreur lors du traitement de la demande");
    } finally {
      setProcessing(false);
    }
  };

  const openActionDialog = (request: JoinRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewMessage("");
  };

  // Redirection si pas autorisé
  if (!loading && (!user?.user?.id || !canModerate)) {
    return (
      <div className="flex-1 px-5 pt-25 pb-[120px]">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Shield className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Accès restreint</h2>
          <p className="text-center text-muted-foreground">
            Seuls les modérateurs et administrateurs du club peuvent accéder à cette page.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/clubs/${clubId}`)}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au club
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="flex-1 px-5 pt-[100px] pb-[120px]">

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary-500" />
            <div className="text-2xl font-bold">{members.length}</div>
            <div className="text-sm text-muted-foreground">Membres</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-warning-300" />
            <div className="text-2xl font-bold">{joinRequests.length}</div>
            <div className="text-sm text-muted-foreground">Demandes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-error-200" />
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-sm text-muted-foreground">Signalements</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-success-200" />
            <div className="text-2xl font-bold">
              {members.filter(m => m.role === "MODERATOR" || m.role === "ADMIN").length}
            </div>
            <div className="text-sm text-muted-foreground">Modérateurs</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de modération */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">
            Demandes ({joinRequests.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Signalements ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="members">
            Membres ({members.length})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Demandes d'adhésion */}
        <TabsContent value="requests" className="mt-6">
          {club?.type === "Public" ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Club public</h3>
                <p className="text-muted-foreground">
                  Les clubs publics n'ont pas de demandes d'adhésion. Les utilisateurs peuvent rejoindre directement.
                </p>
              </CardContent>
            </Card>
          ) : joinRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-muted-foreground">
                  Il n'y a actuellement aucune demande d'adhésion à traiter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {joinRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.user?.profile?.profile_picture_url || undefined} />
                        <AvatarFallback>
                          {request.user?.username?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{request.user?.username}</h3>
                          <Badge variant="outline">{request.status}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          {request.message}
                        </p>
                        
                        <div className="text-xs text-muted-foreground mb-4">
                          Demandé le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                onClick={() => openActionDialog(request, "approve")}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approuver
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approuver la demande</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Vous êtes sur le point d'accepter {request.user?.username} dans le club.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              
                              <div className="space-y-2">
                                <Label htmlFor="approve-message">Message de bienvenue (optionnel)</Label>
                                <Textarea
                                  id="approve-message"
                                  placeholder="Bienvenue dans notre club ! N'hésitez pas à vous présenter..."
                                  value={reviewMessage}
                                  onChange={(e) => setReviewMessage(e.target.value)}
                                />
                              </div>
                              
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleJoinRequestAction}
                                  disabled={processing}
                                >
                                  {processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                  )}
                                  Approuver
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => openActionDialog(request, "reject")}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Rejeter
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Rejeter la demande</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Vous êtes sur le point de rejeter la demande de {request.user?.username}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              
                              <div className="space-y-2">
                                <Label htmlFor="reject-message">Raison du rejet (optionnel)</Label>
                                <Textarea
                                  id="reject-message"
                                  placeholder="Nous avons atteint notre limite de membres pour cette période..."
                                  value={reviewMessage}
                                  onChange={(e) => setReviewMessage(e.target.value)}
                                />
                              </div>
                              
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleJoinRequestAction}
                                  disabled={processing}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  ) : (
                                    <X className="w-4 h-4 mr-2" />
                                  )}
                                  Rejeter
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Signalements */}
        <TabsContent value="reports" className="mt-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun signalement</h3>
                <p className="text-muted-foreground">
                  Il n'y a actuellement aucun signalement à traiter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* TODO: Implémenter l'affichage des signalements */}
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning-300" />
                  <h3 className="text-lg font-semibold mb-2">Gestion des signalements</h3>
                  <p className="text-muted-foreground">
                    Interface de gestion des signalements en cours de développement.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Onglet Membres */}
        <TabsContent value="members" className="mt-6">
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.profile_picture || undefined} />
                        <AvatarFallback>
                          {member.username?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.username}</h3>
                          <Badge variant={
                            member.role === "ADMIN" ? "default" : 
                            member.role === "MODERATOR" ? "secondary" : 
                            "outline"
                          }>
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    
                    {/* Actions sur les membres (si pas owner) */}
                    {member.id !== club?.owner?.id && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            // TODO: Implémenter le bannissement
                            toast.info("Fonction de bannissement à implémenter");
                          }}
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Bannir
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubModerationPage;