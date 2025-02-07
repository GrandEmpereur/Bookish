"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import options from "@/lib/api";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Book {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
}

interface List {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  name: string;
}

const ListsPage = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsResponse, userResponse] = await Promise.all([
          axios.get("https://bookish-api-v2-0580441d6f39.herokuapp.com/book-lists", options),
          axios.get("https://bookish-api-v2-0580441d6f39.herokuapp.com/auth/me", options),
        ]);

        setUser(userResponse.data);
        if (Array.isArray(listsResponse.data)) {
          setLists(listsResponse.data);
        } else {
          setError("Format de données invalide pour les listes.");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Fantasy</h2>
      <div className="flex gap-1 items-center">
        <Book className="w-3 h-3 text-gray-400" />
        <p className="text-xs text-gray-400">{books.length} livres</p>
      </div>

      <div className="mt-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="flex gap-4 items-center mb-4">
              <img
                src={book.coverImage || "/img/onbordingRegisterSetp/Book_Lover.png"}
                alt={`Couverture de ${book.name}`}
                className="rounded-md w-24 h-32 object-cover"
              />
              <div>
                <h6 className="text-lg font-semibold text-gray-700">{book.name}</h6>
                <p className="text-sm text-gray-500">{book.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun livre disponible.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">{list.name}</h3>
              <p className="text-sm text-gray-500">{list.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune liste disponible.</p>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
