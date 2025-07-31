"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { X, Loader2, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UniversalImagePicker } from "@/components/ui/universal-image-picker";

import { clubService } from "@/services/club.service";
import type { ClubType } from "@/types/clubTypes";
import { Capacitor } from "@capacitor/core";

const GENRES = [
  "fantasy",
  "science-fiction",
  "romance",
  "thriller",
  "policier",
  "historique",
  "jeunesse",
  "manga",
  "poésie",
  "théâtre",
  "classique",
  "contemporain",
];

export default function CreateClub() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Public" as ClubType,
    genre: "",
  });

  const [clubPicture, setClubPicture] = useState<File | null>(null);
  const [clubPicturePreview, setClubPicturePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Détection responsive pour le padding-top
  const isNativePlatform = Capacitor.isNativePlatform();
  const topPadding = isNativePlatform ? "pt-[140px]" : "pt-[100px]";

  /* ----------------------------- Handlers ------------------------------ */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as ClubType }));
  };

  const handleImageSelected = (file: File) => {
    setClubPicture(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setClubPicturePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setClubPicture(null);
    setClubPicturePreview("");
  };

  /* ----------------------------- Submit ------------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Front-end validation (mirrors backend Vine schema)
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) return toast.error("Le nom du club est obligatoire");
    if (name.length < 2 || name.length > 100)
      return toast.error("Le nom du club doit contenir entre 2 et 100 caractères");

    if (!description) return toast.error("La description est obligatoire");
    if (description.length < 10 || description.length > 1000)
      return toast.error("La description doit contenir entre 10 et 1000 caractères");

    if (!["Public", "Private"].includes(formData.type))
      return toast.error("Le type de club doit être 'Public' ou 'Private'");

    setIsSubmitting(true);

    try {
      // 1. Build payload
      const payload = {
        name,
        description,
        type: formData.type,
        genre: formData.genre.trim() || "",
      };

      // 2. Decide request type (JSON vs FormData)
      if (!clubPicture) {
        // --- Without image --------------------------------------------------
        const response = await clubService.createClub(payload);
        if (response.status === "success" && response.data?.id) {
          toast.success("Club créé avec succès !");
          return router.push(`/clubs/${response.data.id}`);
        }
      } else {
        // --- With image -----------------------------------------------------
        const form = new FormData();
        form.append("name", payload.name);
        form.append("description", payload.description);
        form.append("type", payload.type);
        form.append("genre", payload.genre);
        form.append("clubPicture", clubPicture);

        const response = await clubService.createClubWithMedia(form);
        if (response.status === "success" && response.data?.id) {
          toast.success("Club créé avec succès !");
          return router.push(`/clubs/${response.data.id}`);
        }
      }

      toast.error("Une erreur inattendue est survenue.");
    } catch (error: any) {
      const message =
        error?.message?.includes("Validation failure")
          ? "Erreur de validation des données. Vérifiez les champs."
          : "Erreur serveur, veuillez réessayer.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------ UI ---------------------------------- */

  return (
    <div className={`flex-1 px-5 ${topPadding} pb-[120px]`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du club */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du club * (2-100 caractères)</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Club des Fans de Fantasy"
              value={formData.name}
              onChange={handleInputChange}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description * (10-1000 caractères)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez votre club en quelques mots... (minimum 10 caractères)"
              className="min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
              minLength={10}
              maxLength={1000}
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Image du club</Label>
            <div className="space-y-4">
              {clubPicturePreview ? (
                <div className="relative">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={clubPicturePreview}
                      alt="Aperçu de l'image du club"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <UniversalImagePicker
                  onImageSelected={handleImageSelected}
                  onError={(error) => toast.error(error)}
                  disabled={isSubmitting}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  maxSizeBytes={5 * 1024 * 1024}
                >
                  <div
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--muted)",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Camera
                        className="h-8 w-8"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                      <div className="text-center">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--foreground)" }}
                        >
                          Ajouter une image de couverture
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          JPG, PNG, GIF ou WEBP (max&nbsp;5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </UniversalImagePicker>
              )}
            </div>
          </div>

          {/* Type de club */}
          <div className="space-y-2">
            <Label>Type de club *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={handleTypeChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Private" id="private" />
                <Label htmlFor="private">Privé</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre principal</Label>
            <select
              id="genre"
              name="genre"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.genre}
              onChange={handleInputChange}
            >
              <option value="">Sélectionnez un genre (optionnel)</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </div>
              ) : (
                "Créer le club"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
