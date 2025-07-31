"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { clubService } from "@/services/club.service";
import { Club, ClubInvitation } from "@/types/clubTypes";
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
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Badge 
} from "@/components/ui/badge";
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
  Loader2, 
  Send, 
  Link2,
  Users,
  Calendar,
  Trash2,
  Copy,
  Plus,
  Shield
} from "lucide-react";
import { toast } from "sonner";

const InvitationsPage = () => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.clubId as string;
  const { user } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [invitations, setInvitations] = useState<ClubInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [creatingInvitation, setCreatingInvitation] = useState(false);
  const [activeTab, setActiveTab] = useState("send");

  // Vérifier les permissions de modération
  const canModerate = user?.user?.id === club?.owner?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les détails du club
        const clubResponse = await clubService.getClub(clubId);
        if (clubResponse.data) {
          setClub(clubResponse.data);
        }

        // Récupérer les invitations existantes
        await fetchInvitations();

      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        toast.error("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchData();
    }
  }, [clubId]);

  const fetchInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const response = await clubService.getInvitations(clubId, { 
        page: 1, 
        perPage: 50 
      });
      if (response.data) {
        setInvitations(response.data.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des invitations:", error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userIdentifier.trim()) {
      toast.error("Veuillez saisir un nom d'utilisateur ou email");
      return;
    }

    setSendingInvitation(true);
    try {
      await clubService.sendInvitation(clubId, {
        userIdentifier: userIdentifier.trim(),
        expiresInDays
      });

      toast.success("Invitation envoyée avec succès !");
      setUserIdentifier("");
      await fetchInvitations();
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'invitation:", error);
      toast.error(error.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setSendingInvitation(false);
    }
  };

  const handleCreateInvitation = async () => {
    setCreatingInvitation(true);
    try {
      const response = await clubService.createInvitation(clubId, {
        expiresInDays
      });

      if (response.data) {
        toast.success("Lien d'invitation créé !");
        await fetchInvitations();
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'invitation:", error);
      toast.error(error.message || "Erreur lors de la création de l'invitation");
    } finally {
      setCreatingInvitation(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      await clubService.deleteInvitation(clubId, invitationId);
      toast.success("Invitation supprimée");
      await fetchInvitations();
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/clubs/join/${code}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Lien copié dans le presse-papiers");
    }).catch(() => {
      toast.error("Impossible de copier le lien");
    });
  };

  // Redirection si pas autorisé
  if (!loading && (!user?.user?.id || !canModerate)) {
    return (
      <div className="flex-1 px-5 pt-25 pb-[120px]">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Shield className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Accès restreint</h2>
          <p className="text-center text-muted-foreground">
            Seuls les propriétaires de club peuvent gérer les invitations.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/clubs/${clubId}`)}
            className="mt-4"
          >
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
    <div className="flex-1 px-5 pt-25 pb-[120px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="text-muted-foreground">
            Gérez les invitations pour le club "{club?.name}"
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">
              <Send className="w-4 h-4 mr-2" />
              Envoyer invitation
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Link2 className="w-4 h-4 mr-2" />
              Gérer invitations
            </TabsTrigger>
          </TabsList>

          {/* Onglet Envoyer invitation */}
          <TabsContent value="send" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inviter un utilisateur</CardTitle>
                <CardDescription>
                  Envoyez une invitation personnalisée à un utilisateur spécifique
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSendInvitation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userIdentifier">Nom d'utilisateur ou email *</Label>
                    <Input
                      id="userIdentifier"
                      placeholder="Ex: utilisateur123 ou user@email.com"
                      value={userIdentifier}
                      onChange={(e) => setUserIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires">Expiration (en jours)</Label>
                    <Input
                      id="expires"
                      type="number"
                      min="1"
                      max="30"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 7)}
                    />
                    <p className="text-xs text-muted-foreground">
                      L'invitation expirera dans {expiresInDays} jour{expiresInDays > 1 ? "s" : ""}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    disabled={sendingInvitation || !userIdentifier.trim()}
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {sendingInvitation ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Envoyer l'invitation
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Créer un lien d'invitation</CardTitle>
                <CardDescription>
                  Générez un lien que vous pouvez partager librement
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-expires">Expiration (en jours)</Label>
                    <Input
                      id="link-expires"
                      type="number"
                      min="1"
                      max="30"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 7)}
                    />
                  </div>

                  <Button
                    onClick={handleCreateInvitation}
                    className="w-full rounded-full"
                    disabled={creatingInvitation}
                    variant="outline"
                  >
                    {creatingInvitation ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Création...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Créer un lien
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Gérer invitations */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invitations actives</CardTitle>
                <CardDescription>
                  Liste des invitations en cours de validité
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {loadingInvitations ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </div>
                ) : invitations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune invitation active</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <div 
                        key={invitation.id} 
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {invitation.isUsed ? "Utilisé" : "Actif"}
                            </Badge>
                            {invitation.usedBy && (
                              <span className="text-sm text-muted-foreground">
                                par {invitation.usedBy.username}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Code: <span className="font-mono bg-muted px-2 py-1 rounded">{invitation.code}</span></p>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Expire le {new Date(invitation.expiresAt).toLocaleDateString('fr-FR')}
                              </span>
                              {(invitation.usesCount ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {invitation.usesCount} utilisation{(invitation.usesCount ?? 0) > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!invitation.isUsed && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyInvitationLink(invitation.code)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'invitation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette invitation ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteInvitation(invitation.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvitationsPage;