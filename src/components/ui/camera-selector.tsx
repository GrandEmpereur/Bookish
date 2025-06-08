"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { Photo } from "@capacitor/camera";

interface CameraSelectorProps {
  onImageSelected: (file: File) => void;
  onError?: (error: string) => void;
  children: React.ReactNode; // Bouton trigger
  disabled?: boolean;
}

export function CameraSelector({
  onImageSelected,
  onError,
  children,
  disabled = false,
}: CameraSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fonction utilitaire pour convertir dataUrl en File
  const dataUrlToFile = async (
    dataUrl: string,
    filename: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      return new File([blob], filename, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Erreur conversion dataUrl vers File:", error);
      return null;
    }
  };

  const { isLoading, isCameraAvailable, takePhoto, pickFromGallery } =
    useCamera({
      onPhotoTaken: handlePhotoTaken,
      onError: onError,
    });

  async function handlePhotoTaken(photo: Photo) {
    try {
      if (!photo.dataUrl) {
        throw new Error("Aucune dataUrl dans la photo");
      }

      const file = await dataUrlToFile(
        photo.dataUrl,
        `photo-${Date.now()}.jpg`
      );
      if (file) {
        onImageSelected(file);
        setIsDialogOpen(false);
      } else {
        throw new Error("Impossible de créer le fichier");
      }
    } catch (error) {
      console.error("Erreur conversion photo:", error);
      onError?.("Erreur lors du traitement de la photo");
    }
  }

  const handleTakePhoto = async () => {
    await takePhoto();
  };

  const handlePickFromGallery = async () => {
    await pickFromGallery();
  };

  // Si la caméra n'est pas disponible, on utilise le sélecteur de fichier classique
  if (!isCameraAvailable) {
    return (
      <div>
        <div
          onClick={() =>
            document.getElementById("fallback-image-input")?.click()
          }
        >
          {children}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImageSelected(file);
            }
          }}
          className="hidden"
          id="fallback-image-input"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <>
      <div onClick={() => setIsDialogOpen(true)}>{children}</div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une photo</DialogTitle>
            <DialogDescription>
              Choisissez comment vous souhaitez ajouter une photo
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={handleTakePhoto}
              disabled={isLoading || disabled}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
              <span className="text-sm">Caméra</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={handlePickFromGallery}
              disabled={isLoading || disabled}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
              <span className="text-sm">Galerie</span>
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
