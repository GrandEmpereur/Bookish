"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, UserMinus, AlertTriangle } from "lucide-react";

interface MessageModerationMenuProps {
  canModerate: boolean;
  onDelete: () => void;
  onBanUser: () => void;
  onReport: () => void;
}

export const MessageModerationMenu = ({
  canModerate,
  onDelete,
  onBanUser,
  onReport,
}: MessageModerationMenuProps) => {
  if (!canModerate) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Signaler le message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer le message
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onBanUser();
          }}
          className="text-destructive focus:text-destructive"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Bannir l'auteur
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
