"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  User,
  Bookmark,
  ChartLine,
  Bell,
  HelpCircle,
  Shield,
  Trash,
  LogOut,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Assurez-vous que ces composants sont disponibles
import { useRouter, usePathname } from "next/navigation";
import { PushDiagnostics } from "@/components/ui/push-diagnostics";
import { Capacitor } from "@capacitor/core";

const SettingItem = ({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) => (
  <Button
    variant="ghost"
    className="flex items-center justify-between w-full px-5 py-7 rounded-none"
    onClick={onClick}
  >
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </Button>
);

const SettingsPage: React.FC = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Détection responsive pour le padding-top
  const isNativePlatform = Capacitor.isNativePlatform();
  const topPadding = isNativePlatform ? "pt-[120px]" : "pt-[100px]";

  const handleLogout = async () => {
    try {
      await authService.logout();

      // Rediriger l'utilisateur après la déconnexion
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // En cas d'erreur côté API, on redirige simplement l'utilisateur
      router.push("/auth/login");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      // Rediriger l'utilisateur après la suppression du compte
      router.push("/auth/register");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className={`flex flex-col gap-10 px-5 pb-[120px] ${topPadding}`}>
      <Card className="shadow-md rounded-xl py-0">
        <CardContent className="p-0 divide-y">
          <SettingItem
            title="Profil"
            icon={User}
            onClick={() => router.push(`${pathname}profile`)}
          />
          <SettingItem
            title="Favoris"
            icon={Bookmark}
            onClick={() => router.push(`${pathname}bookmark`)}
          />
          <SettingItem
            title="Statistiques"
            icon={ChartLine}
            onClick={() => router.push(`${pathname}statistics`)}
          />
          <SettingItem
            title="Notifications"
            icon={Bell}
            onClick={() => router.push(`/notifications`)}
          />
        </CardContent>
      </Card>

      <Card className="shadow-md rounded-xl py-0">
        <CardContent className="p-0 divide-y">
          <SettingItem
            title="Obtenir de l'aide"
            icon={HelpCircle}
            onClick={() => router.push(`${pathname}help`)}
          />
          <SettingItem
            title="Politique de confidentialité"
            icon={Shield}
            onClick={() => router.push(`${pathname}policy`)}
          />
          <SettingItem
            title="Supprimer le compte"
            icon={Trash}
            onClick={() => setIsDeleteDialogOpen(true)}
          />
          <SettingItem
            title="Se déconnecter"
            icon={LogOut}
            onClick={() => setIsLogoutDialogOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Diagnostic Push Notifications */}

      {/* <PushDiagnostics /> */}

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hidden">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la déconnexion</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hidden">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression du compte</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Supprimer le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
