"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Eye } from "lucide-react";
import { createList } from "@/services/listsService"; // Assure-toi que cette fonction existe

const CreateListPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Créer un aperçu de l'image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crée une nouvelle liste via le service API
      await createList({ name, description, isPublic }); // À implémenter dans ton service
      router.push("/lists"); // Redirige vers la liste des listes
    } catch (error) {
      console.error("Erreur lors de la création de la liste :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Affichage de l'image sélectionnée */}
        <div className="mb-4 w-fit m-auto">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Aperçu de l'image"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-md mt-2" />
          )}

          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 hidden"
          />
          <div className="mt-2 text-sm text-blue-600 cursor-pointer text-center">
            Modifier l'image
          </div>
        </div>

        {/* Formulaire de création de liste */}
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la liste"
          required
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la liste"
        />

        {/* Visibilité publique/privée */}
        <div className="flex items-center space-x-3">
          <span>Visibilité :</span>
          <Lock
            className={`w-4 h-4 ${
              !isPublic ? "text-success-300" : "text-gray-400"
            }`}
          />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <div className="w-12 h-6 bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary dark:peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
          <Eye
            className={`w-4 h-4 ${
              isPublic ? "text-success-300" : "text-gray-400"
            }`}
          />
        </div>

        {/* Soumettre la nouvelle liste */}
        <button
          type="submit"
          className="w-full mt-4 bg-primary-500 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer la bibliothèque"}
        </button>
      </form>
    </div>
  );
};

export default CreateListPage;
