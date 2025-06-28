"use client";

import { useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

interface UseCameraOptions {
  onPhotoTaken?: (photo: Photo) => void;
  onError?: (error: string) => void;
}

export function useCamera(options?: UseCameraOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);

  const isIOS = Capacitor.getPlatform() === "ios";
  const isNative = Capacitor.isNativePlatform();

  // Vérifier si la caméra est disponible (uniquement sur iOS natif)
  const isCameraAvailable = isNative && isIOS;

  const requestPermissions = async () => {
    if (!isCameraAvailable) {
      return false;
    }

    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === "granted";
    } catch (error) {
      console.error("Erreur permissions caméra:", error);
      return false;
    }
  };

  const takePhoto = async () => {
    if (!isCameraAvailable) {
      toast.error("La caméra n'est disponible que sur iOS");
      return null;
    }

    try {
      setIsLoading(true);

      // Demander les permissions si nécessaire
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        toast.error("Permission de caméra refusée");
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl, // Base64 pour faciliter l'upload
        source: CameraSource.Camera, // Forcer l'utilisation de la caméra
        width: 1024, // Limiter la taille pour les performances
        height: 1024,
        correctOrientation: true,
      });

      setPhoto(image);
      options?.onPhotoTaken?.(image);

      return image;
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la prise de photo";
      console.error("Erreur caméra:", error);

      // Ne pas afficher d'erreur si l'utilisateur a annulé
      if (
        !error.message?.includes("cancelled") &&
        !error.message?.includes("canceled")
      ) {
        toast.error(errorMessage);
        options?.onError?.(errorMessage);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    if (!isCameraAvailable) {
      toast.error("La sélection de photos n'est disponible que sur iOS");
      return null;
    }

    try {
      setIsLoading(true);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // Sélectionner depuis la galerie
        width: 1024,
        height: 1024,
        correctOrientation: true,
      });

      setPhoto(image);
      options?.onPhotoTaken?.(image);

      return image;
    } catch (error: any) {
      const errorMessage =
        error.message || "Erreur lors de la sélection de photo";
      console.error("Erreur galerie:", error);

      if (
        !error.message?.includes("cancelled") &&
        !error.message?.includes("canceled")
      ) {
        toast.error(errorMessage);
        options?.onError?.(errorMessage);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
  };

  return {
    isLoading,
    photo,
    isCameraAvailable,
    isIOS,
    takePhoto,
    pickFromGallery,
    clearPhoto,
    requestPermissions,
  };
}
