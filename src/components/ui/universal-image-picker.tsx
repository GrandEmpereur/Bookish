"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, ImageIcon, Upload, Loader2 } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

interface UniversalImagePickerProps {
  onImageSelected: (file: File) => void;
  onError?: (error: string) => void;
  children: React.ReactNode; // Bouton trigger
  disabled?: boolean;
  accept?: string; // ex: "image/*" ou "image/*,video/*"
  maxSizeBytes?: number; // Taille max en bytes (par défaut 5MB)
  placeholder?: string;
}

export function UniversalImagePicker({
  onImageSelected,
  onError,
  children,
  disabled = false,
  accept = "image/*",
  maxSizeBytes = 5 * 1024 * 1024, // 5MB par défaut
  placeholder = "Sélectionner un fichier",
}: UniversalImagePickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isNative = Capacitor.isNativePlatform();
  
  // Hook pour les fonctionnalités natives (caméra)
  const { isLoading, isCameraAvailable, takePhoto, pickFromGallery } = useCamera({
    onPhotoTaken: async (photo) => {
      if (photo?.dataUrl) {
        try {
          const file = await dataUrlToFile(photo.dataUrl, `photo-${Date.now()}.jpg`);
          if (file) {
            onImageSelected(file);
            setIsDialogOpen(false);
          }
        } catch (error) {
          console.error("Erreur conversion photo:", error);
          onError?.("Erreur lors du traitement de la photo");
        }
      }
    },
    onError: (error) => {
      onError?.(error);
      setIsDialogOpen(false);
    },
  });

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

  // Validation des fichiers
  const validateFile = (file: File): boolean => {
    // Vérifier le type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type === "image/*") return file.type.startsWith('image/');
      if (type === "video/*") return file.type.startsWith('video/');
      return file.type === type;
    });

    if (!isValidType) {
      onError?.("Type de fichier non supporté");
      return false;
    }

    // Vérifier la taille
    if (file.size > maxSizeBytes) {
      const sizeMB = Math.round(maxSizeBytes / (1024 * 1024));
      onError?.(`Le fichier ne doit pas dépasser ${sizeMB}MB`);
      return false;
    }

    return true;
  };

  // Gestionnaire pour l'input file HTML (web)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onImageSelected(file);
    }
    // Reset input pour permettre de resélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gestionnaires pour les actions natives
  const handleTakePhoto = async () => {
    await takePhoto();
  };

  const handlePickFromGallery = async () => {
    await pickFromGallery();
  };

  // Gestionnaire pour ouvrir le dialog ou l'input selon la plateforme
  const handleTriggerClick = () => {
    if (disabled) return;

    if (isNative && isCameraAvailable) {
      // Sur mobile natif avec caméra disponible : ouvrir le dialog
      setIsDialogOpen(true);
    } else {
      // Sur web ou mobile sans caméra : ouvrir l'input file
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      {/* Input file caché pour le web */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Bouton trigger */}
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {children}
      </div>

      {/* Dialog pour les options natives (caméra + galerie) */}
      {isNative && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter une image</DialogTitle>
              <DialogDescription>
                Choisissez comment vous souhaitez ajouter votre image
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Button
                onClick={handleTakePhoto}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                Prendre une photo
              </Button>

              <Button
                onClick={handlePickFromGallery}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2" />
                )}
                Choisir depuis la galerie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}