"use client";

import React, { useEffect, useState } from "react";
import { Plus, Book, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/services/userService";
import { getLists } from "@/services/listsService";
import Link from "next/link";

interface List {
  id: string;
  name: string;
  books: { id: string }[];
  visibility: "public" | "private";
}

const ListsPage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUser, response] = await Promise.all([
          getCurrentUser(),
          getLists(),
        ]);
        setUser(currentUser);
        setLists(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-40 rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-500">
        Impossible de récupérer les informations de l'utilisateur. Veuillez vous
        reconnecter.
      </p>
    );
  }

  return (
    <div>
      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Votre bibliothèque est vide
          </h2>
          <p className="text-gray-500 mb-4">
            Il est temps de construire votre bibliothèque ! Ajoutez une
            collection pour découvrir et organiser vos livres préférés.
          </p>
          <Button className="mt-4">Créer une collection</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex flex-col gap-2 p-4 shadow-md rounded-md"
            >
              <Link href={`/lists/${list.id}`}>
                <img
                  src="/img/illustrations/books_list_cat.jpg"
                  alt={`Illustration de la liste ${list.name}`}
                  className="bg-red-400 rounded-md object-cover w-full max-h-40"
                />
                <div>
                  <h3 className="font-medium">{list.name}</h3>
                  <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      <Book className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500">
                        {list.books.length}
                      </p>
                    </div>
                    {list.visibility === "public" ? (
                      <Eye className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListsPage;
