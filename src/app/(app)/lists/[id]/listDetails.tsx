"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import options from "@/lib/api";

import { Book } from "lucide-react";

import { Button } from "@/components/ui/button";

const ListsPage = () => {
  const [communities, setCommunities] = useState<[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<"all" | "my">("all");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          "https://bookish-api-v2-0580441d6f39.herokuapp.com/book-lists",
          options
        );
        const userResponse = await axios.get(
          "https://bookish-api-v2-0580441d6f39.herokuapp.com/auth/me",
          options
        );
        setUser(userResponse.data);

        if (Array.isArray(response.data)) {
          setCommunities(response.data);
          setFilteredCommunities(response.data);
        } else {
          setError("Invalid data format for communities");
        }
      } catch (error: any) {
        setError("Error fetching the community data");
        console.error("Error fetching the community data:", error);
      }
    };

    fetchCommunities();
  }, []);

  const books = [
    {
      id: 1,
      name: "La vie devant soi",
      description: "Livres à lire cette année",
    },
    {
      id: 2,
      name: "Liste de souhaits",
      description: "Livres que je veux acheter",
    },
    { id: 3, name: "Livres terminés", description: "Livres que j'ai déjà lus" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Fantasy</h2>
      <div className="flex gap-1 items-center">
        <Book className="w-3 h-3 text-gray-400" />
        <p className="text-xs text-gray-400">100 livres</p>
      </div>

      <div>
        {books.map((book) => (
          <div key={book.id} className="flex gap-4 items-center">
            <img
              src="/img/onbordingRegisterSetp/Book_Lover.png"
              className="bg-red-400 rounded-md max-h-30"
            />
            <div>
              <h6 className="text-lg font-semibold text-gray-700">
                {book.name}
              </h6>
              <p className="text-sm text-gray-500">{book.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white p-4 rounded-md shadow-md flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold text-gray-700">{list.name}</h3>
            <p className="text-sm text-gray-500">{list.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListsPage;
