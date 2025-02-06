"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Plus, Book, Lock, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { getLists } from "@/services/listsService";

const ListsPage = () => {
  const [communities, setCommunities] = useState<[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  // const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<"all" | "my">("all");

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lists, setLists] = useState<[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getLists();
        const data = Array.isArray(response.data) ? response.data : [];
        setLists(data);
        console.log("Nombre de listes:", data.length);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchLists();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4">
        <Skeleton className="w-full h-10 mb-4 rounded" />
        <Skeleton className="w-full h-6 mb-2 rounded" />
        <Skeleton className="w-full h-40 mb-4 rounded" />
        <Skeleton className="w-full h-10 mb-4 rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <p>
        Impossible de récupérer les informations de l'utilisateur. Veuillez vous
        reconnecter.
      </p>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50">
        <div>
          {/* <img
        src="/img/illustrations/books_list.jpg"
        alt="No books illustration"
        className="w-40 h-40 mx-auto mb-6"
      /> */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Votre bibliothèque est vide
          </h2>
          <p className="text-gray-500 mb-4">
            Il est temps de construire votre bibliothèque ! Ajoutez une
            collection pour découvrir et organiser vos livres préférés.
          </p>
          <Button className="mt-4">Créer une collection</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2  items-center ">
        <p>Créer une nouvelle liste </p>
        <Plus
          className="h-5 w-5"
          onClick={() => {
            setShowDialog(true);
          }}
        />
      </div>

      {/* Faire une condition pour l'affichage des images quand ya un ou plusieurs livres dans la liste @remind */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="flex flex-col gap-2 p-4 shadow-md rounded-xl"
          >
            <p></p>
            <img
              src="/img/illustrations/books_list_cat.jpg"
              className="bg-red-400 rounded-md  object-cover max-h-40 "
            />
            <div>
              <h3>{list.name}</h3>
              <div className="flex justify-between ">
                <div className="flex gap-1 items-center">
                  <Book className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">{list.books.length}</p>
                </div>
                {list.visibility === "public" ? (
                  <Eye className="w-3 h-3 text-gray-400" />
                ) : (
                  <Lock className="w-3 h-3 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListsPage;
