"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import options from "@/lib/api";

import { Plus } from "lucide-react";

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
          "https://dev-bookish-api-62a3a4e0be02.herokuapp.com/book-lists?page=1&limit=20&sort=created_at&order=desc",
          options
        );
        const userResponse = await axios.get(
          "https://dev-bookish-api-62a3a4e0be02.herokuapp.com/auth/me",
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

  const lists = [
    {
      id: 1,
      name: "Liste de lecture",
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
      <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50">
        <div>
          {/* <img
            src="/img/onbordingRegisterSetp/Book_Lover.png"
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
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-xl">
          <div className="flex gap-2 aspect-square sm:aspect-[4/3] md:aspect-[16/9]">
            <img
              src="/img/onbordingRegisterSetp/Book_Lover.png"
              className="bg-red-400 rounded-md w-4/6 object-cover"
            />
            <div className="gap-2 w-2/6 flex flex-col">
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
            </div>
          </div>
          <div>
            <h3>A lire</h3>
            <div className="flex gap-1 items-center">
              {/* <LibraryBig className="w-3 h-3 text-gray-400" /> */}
              <p className="text-xs text-gray-400">100 livres</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 shadow-md rounded-xl">
          <div className="flex gap-2 aspect-square sm:aspect-[4/3] md:aspect-[16/9]">
            <img
              src="/img/onbordingRegisterSetp/Book_Lover.png"
              className="bg-red-400 rounded-md w-4/6 object-cover"
            />
            <div className="gap-2 w-2/6 flex flex-col">
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
            </div>
          </div>
          <div>
            <h3>A lire</h3>
            <div className="flex gap-1 items-center">
              {/* <LibraryBig className="w-3 h-3 text-gray-400" /> */}
              <p className="text-xs text-gray-400">100 livres</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 shadow-md rounded-xl">
          <div className="flex gap-2 aspect-square sm:aspect-[4/3] md:aspect-[16/9]">
            <img
              src="/img/onbordingRegisterSetp/Book_Lover.png"
              className="bg-red-400 rounded-md w-4/6 object-cover"
            />
            <div className="gap-2 w-2/6 flex flex-col">
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
              <img
                src="/img/onbordingRegisterSetp/Book_Lover.png"
                className="bg-red-400 rounded-md h-1/2 object-cover"
              />
            </div>
          </div>
          <div>
            <h3>A lire</h3>
            <div className="flex gap-1 items-center">
              {/* <LibraryBig className="w-3 h-3 text-gray-400" /> */}
              <p className="text-xs text-gray-400">100 livres</p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="mt-16">Mes Listes</h1>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <h2>{list.name}</h2>
            <p>{list.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListsPage;
