"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services/notification.service";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export function PushDiagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    isNativePlatform: false,
    permissions: null as any,
    hasToken: false,
    serverConnection: null as boolean | null,
    userSettings: null as any,
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    checkBasicInfo();
  }, []);

  const checkBasicInfo = async () => {
    const isNative = Capacitor.isNativePlatform();
    setDiagnostics((prev) => ({ ...prev, isNativePlatform: isNative }));

    if (isNative) {
      try {
        const permissions = await PushNotifications.checkPermissions();
        setDiagnostics((prev) => ({ ...prev, permissions }));
      } catch (error) {
        console.error("Erreur vérification permissions:", error);
      }
    }
  };

  const forceTokenRegistration = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      toast.info("🔄 Force registration du token...");

      // Setup listener temporaire
      let tokenReceived = false;
      const tokenListener = await PushNotifications.addListener(
        "registration",
        async (token) => {
          if (tokenReceived) return;
          tokenReceived = true;

          try {
            await notificationService.registerDeviceToken(token.value);
            toast.success("✅ Token réel enregistré avec succès!");

            // Test immédiat
            setTimeout(async () => {
              try {
                await notificationService.sendTestPush(
                  "Token Test",
                  "Token réel maintenant enregistré!"
                );
                toast.success("🚀 Notification avec token réel envoyée!");
              } catch (error) {
                toast.error("❌ Échec envoi avec token réel");
              }
            }, 1000);
          } catch (error) {
            console.error("❌ Erreur enregistrement token forcé:", error);
            toast.error("❌ Échec enregistrement token");
          } finally {
            tokenListener.remove();
          }
        }
      );

      // Force register
      await PushNotifications.register();

      // Timeout si pas de token reçu
      setTimeout(() => {
        if (!tokenReceived) {
          tokenListener.remove();
          toast.error("⏰ Timeout - pas de token reçu");
        }
      }, 10000);
    } catch (error) {
      console.error("❌ Erreur force registration:", error);
      toast.error("❌ Erreur force registration");
    }
  };

  const runFullDiagnostic = async () => {
    setIsRunning(true);

    try {
      if (!Capacitor.isNativePlatform()) {
        toast.error("Notifications push disponibles uniquement sur mobile");
        return;
      }

      // 1. Vérifier les permissions
      const permissions = await PushNotifications.checkPermissions();
      setDiagnostics((prev) => ({ ...prev, permissions }));

      if (permissions.receive !== "granted") {
        toast.info("Demande de permissions nécessaire");
        const newPermissions = await PushNotifications.requestPermissions();
        setDiagnostics((prev) => ({ ...prev, permissions: newPermissions }));

        if (newPermissions.receive !== "granted") {
          toast.error("Permissions refusées par l'utilisateur");
          return;
        }
      }

      // 2. Tenter l'enregistrement
      try {
        await PushNotifications.register();
        toast.success("📱 Enregistrement push réussi");
      } catch (error) {
        toast.error("❌ Échec enregistrement push");
        console.error("Erreur register:", error);
        return;
      }

      // 3. Test connexion serveur (le token est déjà géré par le hook principal)
      try {
        await notificationService.registerDeviceToken(
          "diagnostic-test-" + Date.now()
        );
        setDiagnostics((prev) => ({ ...prev, serverConnection: true }));
        toast.success("🌐 Serveur push accessible");
        toast.info("ℹ️ Le token réel est géré par le système principal");
      } catch (error) {
        setDiagnostics((prev) => ({ ...prev, serverConnection: false }));
        toast.error("❌ Problème serveur push");
        console.error("Erreur serveur:", error);
      }

      // 4. Test envoi notification
      try {
        await notificationService.sendTestPush(
          "Test Diagnostic",
          "Notification de test envoyée avec succès !"
        );
        toast.success("🚀 Notification test envoyée");
      } catch (error) {
        toast.error("❌ Échec envoi notification test");
        console.error("Erreur test push:", error);
      }
    } catch (error) {
      console.error("❌ Erreur diagnostic complet:", error);
      toast.error("Erreur lors du diagnostic");
    } finally {
      setIsRunning(false);
    }
  };

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null)
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (status === true)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const StatusBadge = ({ status }: { status: boolean | null }) => {
    if (status === null) return <Badge variant="secondary">Non testé</Badge>;
    if (status === true) return <Badge className="bg-green-500">OK</Badge>;
    return <Badge variant="destructive">Erreur</Badge>;
  };

  if (!Capacitor.isNativePlatform()) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Diagnostic Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les notifications push ne sont disponibles que sur les appareils
            mobiles (iOS/Android).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔔 Diagnostic Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statut plateforme */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Plateforme native</span>
          <div className="flex items-center gap-2">
            <StatusIcon status={diagnostics.isNativePlatform} />
            <StatusBadge status={diagnostics.isNativePlatform} />
          </div>
        </div>

        {/* Permissions */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Permissions</span>
          <div className="flex items-center gap-2">
            <StatusIcon
              status={diagnostics.permissions?.receive === "granted"}
            />
            <Badge
              variant={
                diagnostics.permissions?.receive === "granted"
                  ? "default"
                  : "destructive"
              }
            >
              {diagnostics.permissions?.receive || "Non vérifiées"}
            </Badge>
          </div>
        </div>

        {/* Connexion serveur */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Serveur push</span>
          <div className="flex items-center gap-2">
            <StatusIcon status={diagnostics.serverConnection} />
            <StatusBadge status={diagnostics.serverConnection} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button
            onClick={runFullDiagnostic}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Diagnostic en cours...
              </div>
            ) : (
              "🔍 Lancer diagnostic complet"
            )}
          </Button>

          <Button onClick={checkBasicInfo} variant="outline" className="w-full">
            ⚡ Vérification rapide
          </Button>

          <Button
            onClick={forceTokenRegistration}
            variant="secondary"
            className="w-full"
          >
            🔄 Force Token Registration
          </Button>
        </div>

        {/* Informations détaillées */}
        {diagnostics.permissions && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Détails techniques :</h4>
            <div className="text-xs space-y-1">
              <div>Plateforme: {Capacitor.getPlatform()}</div>
              <div>Permissions: {diagnostics.permissions.receive}</div>
              {diagnostics.serverConnection !== null && (
                <div>
                  Serveur:{" "}
                  {diagnostics.serverConnection
                    ? "✅ Connecté"
                    : "❌ Déconnecté"}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
