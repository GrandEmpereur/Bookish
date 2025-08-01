"use client";

import Image from "next/image";
import { Bell, Send, ChevronLeft, Search } from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { NotificationBadgeIcon } from "@/components/ui/notification-badge-icon";
import { cn } from "@/lib/utils";
import { getTopBarConfig, TopBarConfig } from "@/config/navigation";
import { SearchDrawer } from "@/components/library/search-drawer";
import { SearchDialog } from "@/components/library/search-dialog";
import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/services/message.service";
import { useAuth } from "@/contexts/auth-context";

interface TopBarProps {
  config?: TopBarConfig;
  className?: string;
  dynamicTitle?: string;
}

export function TopBar({ config, className, dynamicTitle }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalType, setModalType] = useState<"drawer" | "dialog" | null>(null);

  // Détection de la plateforme
  const isNative = Capacitor.isNativePlatform();
  const isBrowser = !isNative;

  // Récupération des conversations pour les pages de conversation
  const conversationId = params?.id as string;
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await messageService.getConversations();
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });

  // Trouve la conversation courante
  const currentConversation = conversations.find(
    (conv: any) => conv.id === conversationId
  );

  // On récupère la config de base
  const baseConfig = config || getTopBarConfig(pathname);

  // On modifie la config pour le dialogue de recherche
  const currentConfig = {
    ...baseConfig,
    rightIcons: baseConfig.rightIcons?.map((icon) => {
      if (icon.icon === Search) {
        return {
          ...icon,
          onClick: () => {
            setModalType(icon.modalType || "dialog");
            setSearchOpen(true);
          },
        };
      }
      return icon;
    }),
  };

  const renderLeftSide = () => {
    // Variant conversation : Back button + Avatar + Nom
    if (
      currentConfig.variant === "conversation" &&
      currentConfig.showConversationUser
    ) {
      // Si on a pas encore chargé les conversations, afficher un placeholder
      if (!currentConversation && conversationId) {
        return (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center"
            >
              <ChevronLeft style={{ width: "24px", height: "24px" }} />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">?</AvatarFallback>
            </Avatar>
            <span className="font-medium text-base truncate">
              Chargement...
            </span>
          </div>
        );
      }

      if (currentConversation) {
        const partner = currentConversation.is_group
          ? null
          : currentConversation.participants?.find(
              (p: any) => p.id !== user?.id
            );

        const displayName = currentConversation.is_group
          ? currentConversation.title
          : partner?.username;

        const avatarText = currentConversation.is_group
          ? currentConversation.title?.charAt(0).toUpperCase()
          : partner?.username?.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center"
            >
              <ChevronLeft style={{ width: "24px", height: "24px" }} />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">
                {avatarText || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-base whitespace-nowrap">
              {displayName || "Conversation"}
            </span>
          </div>
        );
      }
    }

    if (currentConfig.showBack) {
      return (
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ChevronLeft style={{ width: "24px", height: "24px" }} />
        </Button>
      );
    }

    if (currentConfig.showLogo) {
      return (
        <div className="flex items-center gap-2">
          <Image
            src="/Bookish2.svg"
            alt="Bookish"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
          <span className="text-lg font-medium">Bookish</span>
        </div>
      );
    }

    return <div className="w-8" />; // Espace réservé pour maintenir l'alignement
  };

  const handleIconClick = (
    iconConfig: NonNullable<TopBarConfig["rightIcons"]>[number]
  ) => {
    if (iconConfig.onClick) {
      iconConfig.onClick();
    } else if (iconConfig.href) {
      router.push(iconConfig.href);
    }
  };

  const renderRightIcons = () => {
    if (!currentConfig.rightIcons?.length) {
      return <div className="w-8" />; // Espace réservé
    }

    return (
      <div className="flex items-center gap-4">
        {currentConfig.rightIcons.map((iconConfig, index) => {
          const Icon = iconConfig.icon;
          const isNotificationIcon = Icon === Bell;

          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleIconClick(iconConfig)}
              className={cn(
                "w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors",
                isNotificationIcon && "relative"
              )}
            >
              {isNotificationIcon ? (
                <>
                  <Bell size={20} />
                  {/* Badge positionné par rapport au bouton */}
                  <NotificationBadgeIcon />
                </>
              ) : (
                <Icon size={20} />
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderTitle = () => {
    // Pour le variant conversation, le titre est géré dans renderLeftSide
    if (currentConfig.variant === "conversation") return null;

    if (!currentConfig.title) return null;

    return currentConfig.title;
  };

  if (currentConfig.showBackAbsolute) {
    return (
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="w-8 h-8 flex items-center justify-center absolute top-[30px] left-5 z-50"
      >
        <ChevronLeft style={{ width: "24px", height: "24px" }} />
      </Button>
    );
  }

  if (currentConfig.hideTopBar) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 bg-background border-b z-50",
          className
        )}
      >
        <div
          className={cn(
            "px-5 flex items-center justify-between",
            isNative ? "py-2 pt-[70px]" : "py-3 pt-[30px]"
          )}
        >
          {/* Conteneur gauche - même largeur que la droite */}
          <div className="w-[72px]">{renderLeftSide()}</div>

          {/* Titre centré */}
          <div className="flex-1 flex justify-center">
            {currentConfig.title && (
              <h1 className="text-2xl font-heading">{renderTitle()}</h1>
            )}
          </div>

          {/* Conteneur droit - même largeur que la gauche */}
          <div className="w-[72px] flex justify-end">{renderRightIcons()}</div>
        </div>
      </header>

      {modalType === "drawer" ? (
        <SearchDrawer open={searchOpen} onOpenChange={setSearchOpen} />
      ) : modalType === "dialog" ? (
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      ) : null}
    </>
  );
}
