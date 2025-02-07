"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Eye } from "lucide-react";
import { createList } from "@/services/listsService";

const CreateListPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createList({
        name,
        description,
        genre,
        isPublic,
        image,
      });

      router.push("/lists");
    } catch (error) {
      console.error("Erreur lors de la création de la liste :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Aperçu de l'image */}
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
          <label
            htmlFor="image"
            className="mt-2 text-sm text-blue-600 cursor-pointer text-center block"
          >
            Modifier l'image
          </label>
        </div>

        {/* Nom */}
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la bibliothèque"
          required
        />

        {/* Description */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la bibliothèque"
        />

        {/* Genre */}
        <Input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre de la bibliothèque"
          required
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

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer la bibliothèque"}
        </button>
      </form>
    </div>
  );
};

export default CreateListPage;
