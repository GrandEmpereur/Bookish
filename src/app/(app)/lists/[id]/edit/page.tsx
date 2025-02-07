"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getListById, updateList, deleteList } from "@/services/listsService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface List {
  id: string;
  name: string;
  description: string;
  genre: string;
  isPublic: boolean;
  coverImage?: string;
}

const EditListPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // Typage des params
  const [list, setList] = useState<List | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données de la liste
  useEffect(() => {
    const fetchList = async () => {
      if (!id) return;
      try {
        const response = await getListById(id);
        const listData = response.data;
        setList(listData);
        setName(listData.name);
        setDescription(listData.description);
        setGenre(listData.genre);
        setIsPublic(listData.visibility);
        setImagePreview(listData.coverImage);
      } catch (error) {
        console.error("Erreur lors de la récupération de la liste :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateList(id, {
        name,
        description,
        genre,
        isPublic,
        image,
      });

      router.push(`/lists/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la liste :", error);
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteList(id);
      router.push("/lists");
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste", error);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col gap-6 px-4">
        <Skeleton className="w-full h-40 mb-4 rounded" />
        <Skeleton className="w-full h-10  rounded" />
        <Skeleton className="w-full h-10  rounded" />
        <Skeleton className="w-full h-10  rounded" />
      </div>
    );
  if (!list) return <p>Liste introuvable.</p>;

  return (
    <div className="md:max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Aperçu de l'image */}
        <div className="mb-4 w-fit m-auto">
          <img
            src={imagePreview || "/img/illustrations/books_list_cat.jpg"}
            alt="Aperçu de la liste"
            className="w-32 h-32 object-cover rounded-md"
          />
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="image"
            className="block mt-2 text-sm text-blue-600 cursor-pointer text-center"
          >
            Modifier l'image
          </label>
        </div>

        {/* Formulaire d'édition */}
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
        <Input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre de la liste"
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

        {/* Bouton de mise à jour */}
        <button
          type="submit"
          className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md"
        >
          Mettre à jour la bibliothèque
        </button>

        {/* Suppression de la liste */}
        <p
          onClick={handleDeleteList}
          className="text-red-600 cursor-pointer pt-4"
        >
          Supprimer la bibliothèque
        </p>
      </form>
    </div>
  );
};

export default EditListPage;
