"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchUsers } from "@/services/searchService";
import { searchBooks } from "@/services/bookService";
import { User } from "@/types/user";
import { Book } from "@/types/book";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Gestion du délai de debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Récupérer les résultats dès que la recherche est effectuée
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchResults(debouncedQuery);
    } else if (debouncedQuery === "") {
      setUsers([]);
      setBooks([]);
    }
  }, [debouncedQuery]);

  // Fonction pour récupérer les résultats (utilisateurs et livres)
  const fetchResults = async (searchValue: string) => {
    setLoading(true);
    setError(null);

    try {
      // Recherche des utilisateurs
      const userResponse = await searchUsers();
      const usersData = userResponse.data?.users || [];
      setUsers(
        usersData.filter(
          (user) =>
            user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.profile?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.profile?.bio?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

      // Recherche des livres
      const allBooksResponse = await searchBooks();
      const allBooks = allBooksResponse.data || [];
      setBooks(
        allBooks.filter(
          (book: any) =>
            book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            book.author.toLowerCase().includes(searchValue.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction de rendu du profil utilisateur
  const renderUserProfile = (profile: UserProfile) => {
    if (profile.profileVisibility === "private") {
      return <p>Ce profil est privé.</p>;
    }

    return (
      <>
        <p>Nom complet: {profile.fullName}</p>
        <p>Bio: {profile.bio}</p>
        <p>Lieu: {profile.location}</p>
        {profile.profilePicturePath && (
          <img
            src={profile.profilePicturePath}
            alt="Profile Picture"
            className="w-10 h-10 rounded-full"
          />
        )}
        <p>Rôle: {profile.role}</p>
      </>
    );
  };

  return (
    <div className="relative flex flex-col gap-6 px-4">
      {/* Barre de recherche */}
      <div className="flex gap-4 relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un utilisateur, un livre par nom , autheur ou genre"
        />
      </div>

      {/* Message d'erreur */}
      {error && <p className="text-error text-center">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="w-full h-10 mb-4 rounded" />
          <Skeleton className="w-full h-6 mb-2 rounded" />
          <Skeleton className="w-full h-40 mb-4 rounded" />
          <Skeleton className="w-full h-10 mb-4 rounded" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-6">
          {/* Affichage des utilisateurs uniquement si la recherche concerne des utilisateurs */}
          {users.length > 0 && books.length === 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold">Utilisateurs trouvés:</h2>
              {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-2 p-4 border rounded-md">
                  <h3 className="font-semibold">{user.username}</h3>
                  {renderUserProfile(user.profile)}
                </div>
              ))}
            </div>
          ) : null}

          {/* Affichage des livres uniquement si la recherche concerne des livres */}
          {books.length > 0 && users.length === 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold">Livres trouvés:</h2>
              {books.map((book) => (
                <div key={book.id} className="flex flex-col gap-2 p-4 border rounded-md">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-32 h-48 object-cover"
                    />
                  )}
                  <h3 className="font-semibold">{book.title}</h3>
                  <p>Auteur: {book.author}</p>
                  <p>Genre: {book.genre}</p>
                  <p>Année de publication: {book.publicationYear}</p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Affichage du message "Aucun livre trouvé" ou "Aucun utilisateur trouvé" */}
          {users.length === 0 && books.length === 0 && query && (
            <p>Aucun résultat trouvé pour "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
