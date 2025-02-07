"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/userService";
import { getListById } from "@/services/listsService";
import { Skeleton } from "@/components/ui/skeleton";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage?: string;
}

interface List {
  id: string;
  name: string;
  description?: string;
  books: Book[];
}

interface ListPageProps {
  params: {
    id: string;
  };
}

const ListPage: React.FC<ListPageProps> = ({ params }) => {
  const { id } = params;
  const [user, setUser] = useState<any | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUser, listData] = await Promise.all([
          getCurrentUser(),
          getListById(id),
        ]);
        setUser(currentUser);
        setList(listData.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-30 rounded" />
        <Skeleton className="w-full h-30 rounded" />
        <Skeleton className="w-full h-30 rounded" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center text-red-500">La liste est introuvable.</div>
    );
  }

  return (
    <div className="list-page">
      {/* Description de la liste */}
      {list.description && (
        <p className="text-sm text-gray-500 mb-4">{list.description}</p>
      )}

      {/* Vérification si la liste contient des livres */}
      {list.books?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.books.map((book) => (
            <div key={book.id} className="flex gap-4">
              {/* Image du livre */}
              <div className="h-24 w-20">
                <img
                  src={
                    book.coverImage || "/img/illustrations/books_list_cat.jpg"
                  }
                  alt={`Couverture du livre ${book.title}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Infos du livre */}
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
                <div>
                  <p className="text-xs py-0.5 px-2 text-gray-500 w-fit rounded-full border border-gray-500">
                    {book.genre}
                  </p>
                  <div className="border-t border-gray-500 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Message si la collection est vide
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            La collection est vide
          </h2>
          <p className="text-gray-500 mb-4">Ajoutez-y des livres !</p>
        </div>
      )}
    </div>
  );
};

export default ListPage;
