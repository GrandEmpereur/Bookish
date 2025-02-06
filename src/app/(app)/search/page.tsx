"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchUsers } from "@/services/searchService";
import { searchBooks } from "@/services/bookService";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { sendFriendRequest } from "@/services/userService";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchResults(debouncedQuery);
    } else if (debouncedQuery === "") {
      setUsers([]);
      setBooks([]);
    }
  }, [debouncedQuery]);

  const fetchResults = async (searchValue: string) => {
    setLoading(true);
    setError(null);

    try {
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

  const handleSendFriendRequest = async (userId: string) => {
    console.log("Envoi de la demande d'ami pour l'ID utilisateur:", userId);
    try {
      await sendFriendRequest(userId);
      console.log("Demande d'ami envoyée avec succès.");
      setMessage("Demande d'ami envoyée avec succès.");
      setMessageType("success");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      if (error.message === "Une demande d'ami existe déjà") {
        setMessage("Vous avez déjà envoyé une demande d'ami à cet utilisateur.");
        setMessageType("error");
      } else {
        setMessage("Vous avez déjà envoyé une demande d'ami à cet utilisateur.");
        setMessageType("error");
      }
    }
  };

  const renderUserProfile = (profile: UserProfile) => {
    if (profile.profileVisibility === "private") {
      return <p>Ce profil est privé.</p>;
    }

    return (
      <>
        <p>{profile.fullName}</p>
        {profile.profilePicturePath && profile.profilePicturePath !== null && (
          <img
            src={profile.profilePicturePath}
            alt="Profile Picture"
            className="w-10 h-10 rounded-full"
          />
        )}
      </>
    );
  };

  return (
    <div className="relative flex flex-col gap-6 px-4">
      <div className="flex gap-4 relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un utilisateur, un livre par nom, auteur ou genre"
        />
      </div>
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
          {users.length > 0 && books.length === 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold">Utilisateurs trouvés:</h2>
              {users.map((user) => {
                console.log("Utilisateur affiché:", user);
                return (
                  <div key={user.id} className="flex flex-row gap-2 p-4 border rounded-md items-center gap-6">
                    <h3 className="font-semibold">{user.username}</h3>
                    {renderUserProfile(user.profile)}
                    <button
                      onClick={() => {
                        console.log("Le bouton a été cliqué pour l'utilisateur:", user.id);
                        handleSendFriendRequest(user.id);
                      }}
                      className="mt-4 py-2 px-4 w-40 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Envoyer une demande d'ami
                    </button>
                    {message && (
                      <p
                        className={`mt-2 ${
                          messageType === "success" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

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
                  <p>{book.author}</p>
                  <p>{book.genre}</p>
                  <p>{book.publicationYear}</p>
                </div>
              ))}
            </div>
          ) : null}

          {users.length === 0 && books.length === 0 && query && (
            <p>Aucun résultat trouvé pour "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
