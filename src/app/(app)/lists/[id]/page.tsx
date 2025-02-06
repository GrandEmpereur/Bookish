"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/userService";
import { getListById } from "@/services/listsService"; // Assure-toi que la fonction existe
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton pour les données en attente

interface ListPageProps {
  params: {
    id: string; // ID de la liste
  };
}

const ListPage: React.FC<ListPageProps> = ({ params }) => {
  const { id } = params;
  const [user, setUser] = useState<any | null>(null);
  const [list, setList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les informations de l'utilisateur
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
      }
    };

    fetchCurrentUser();
  }, []);

  // Récupérer les détails de la liste par ID
  useEffect(() => {
    const fetchList = async () => {
      try {
        const listData = await getListById(id);
        setList(listData.data); // Assure-toi que `listData.data` contient la liste
      } catch (error) {
        console.error("Erreur lors de la récupération de la liste :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  // Afficher un Skeleton pendant le chargement
  if (loading) {
    return <Skeleton />;
  }

  if (!list) {
    return <div>La liste est introuvable.</div>;
  }

  return (
    <div className="list-page">
      <div className="books-section">
        {list.books.length > 0 ? (
          <div>
            {list.description && (
                          <p className="text-sm text-gray-500 mb-4">{list.description}</p>

            )}
            <div className="books-section">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {list.books.map((book: any) => (
                  <div key={book.id} className="flex gap-4">
                    <div className="h-24 w-20">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full  object-cover rounded-md"
                      />
                    </div>
                    <div className="flex flex-col justify-between w-full">
                      <div>
                        <h3>{book.title}</h3>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                      <div>
                      <p className="text-xs py-0.5 px-2 text-gray-500 w-fit  rounded-full border-solid border-[1px] border-gray-500 ">
                        {book.genre}
                      </p>
                      <div className="border-t-[1px] border-solid border-gray-500 mt-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                La collection est vide
              </h2>
              <p className="text-gray-500 mb-4">Ajoutez-y des livres ! </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage;
