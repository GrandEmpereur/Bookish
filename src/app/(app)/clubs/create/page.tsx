"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clubService } from "@/services/club.service";
import type { CreateClubRequest, ClubType } from "@/types/clubTypes";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as ClubType }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.genre) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const clubData: CreateClubRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        genre: formData.genre,
      };

      const response = await clubService.createClub(clubData);
      
      if (response.data) {
        toast.success("Club créé avec succès !");
        setTimeout(() => {
          router.push(`/clubs/${response.data.data.id}`);
        }, 500);
      }
    } catch (error: any) {
      console.error("Erreur création club:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création du club.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 pt-25">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Créer un club</h1>
          <p className="text-muted-foreground">
            Créez votre propre communauté de lecture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du club */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du club *</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Ex: Club des Fans de Fantasy"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez votre club en quelques mots..."
              className="min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
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
            <p className="text-sm text-muted-foreground">
              {formData.type === "Public" 
                ? "Tout le monde peut rejoindre ce club" 
                : "Les membres doivent demander à rejoindre ce club"
              }
            </p>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre principal *</Label>
            <select
              id="genre"
              name="genre"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.genre}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez un genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton de soumission */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Création en cours...
              </div>
            ) : (
              "Créer le club"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
