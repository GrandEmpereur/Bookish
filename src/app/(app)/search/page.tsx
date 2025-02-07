"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchService } from "@/services/search.service";
import { UserProfile } from "@/types/userTypes";
import { Book } from "@/types/bookTypes";
import { BookList } from "@/types/bookListTypes";
import { Club } from "@/types/clubTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Book as BookIcon, Users } from "lucide-react";

interface SearchResults {
  bookLists: {
    data: BookList[];
    pagination: any;
  };
  books: {
    data: Book[];
    pagination: any;
  };
  clubs: {
    data: Club[];
    pagination: any;
  };
  users: {
    data: UserProfile[];
    pagination: any;
  };
}

interface SearchState {
  results: SearchResults;
  totals: {
    bookLists: number;
    books: number;
    clubs: number;
    users: number;
    total: number;
  };
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'books' | 'clubs' | 'lists'>('all');

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
      setResults(null);
    }
  }, [debouncedQuery]);

  const fetchResults = async (searchValue: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchService.searchGeneral({ query: searchValue });
      
      if (response.status === "success") {
        setResults({
          results: response.data.results,
          totals: response.data.totals
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 px-4 pt-[120px] pb-[120px]">
      <div className="flex gap-4 relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          className="w-full"
        />
      </div>

      {error && <p className="text-error text-center">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </div>
      ) : results?.results ? (
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              Tout ({results.totals.total})
            </TabsTrigger>
            <TabsTrigger value="users">
              Utilisateurs ({results.totals.users})
            </TabsTrigger>
            <TabsTrigger value="books">
              Livres ({results.totals.books})
            </TabsTrigger>
            <TabsTrigger value="clubs">
              Clubs ({results.totals.clubs})
            </TabsTrigger>
            <TabsTrigger value="lists">
              Listes ({results.totals.bookLists})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {results.results.users?.data?.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-bold">Utilisateurs</h2>
                {results.results.users.data.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profile?.profile_picture_url || ""} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{user.username}</p>
                      {user.profile?.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{user.profile.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.results.books?.data?.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-bold">Livres</h2>
                {results.results.books.data.map((book) => (
                  <div key={book.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="relative min-w-[100px] h-[150px] overflow-hidden rounded-md">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{book.description}</p>
                      <div className="flex gap-2 mt-auto pt-2">
                        {book.genres?.map((genre) => (
                          <Badge key={genre} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.results.clubs?.data?.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-bold">Clubs</h2>
                {results.results.clubs.data.map((club) => (
                  <div key={club.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="relative min-w-[120px] h-[120px] overflow-hidden rounded-md">
                      {club.coverImage ? (
                        <Image
                          src={club.coverImage}
                          alt={club.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-lg">{club.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>
                      <div className="mt-auto pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{club.memberCount} membre{club.memberCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.results.bookLists?.data?.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-bold">Listes de lecture</h2>
                {results.results.bookLists.data.map((list) => (
                  <div key={list.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-lg">{list.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{list.description}</p>
                      <div className="mt-auto pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <BookIcon className="h-4 w-4" />
                        <span>{list.bookCount} livre{list.bookCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {results.results.users?.data?.length > 0 ? (
              <div className="space-y-4">
                {results.results.users.data.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profile?.profile_picture_url || ""} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{user.username}</p>
                      {user.profile?.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{user.profile.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
          </TabsContent>

          <TabsContent value="books" className="space-y-6">
            {results.results.books?.data?.length > 0 ? (
              <div className="space-y-4">
                {results.results.books.data.map((book) => (
                  <div key={book.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="relative min-w-[100px] h-[150px] overflow-hidden rounded-md">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{book.description}</p>
                      <div className="flex gap-2 mt-auto pt-2">
                        {book.genres?.map((genre) => (
                          <Badge key={genre} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Aucun livre trouvé
              </div>
            )}
          </TabsContent>

          <TabsContent value="clubs" className="space-y-6">
            {results.results.clubs?.data?.length > 0 ? (
              <div className="space-y-4">
                {results.results.clubs.data.map((club) => (
                  <div key={club.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="relative min-w-[120px] h-[120px] overflow-hidden rounded-md">
                      {club.coverImage ? (
                        <Image
                          src={club.coverImage}
                          alt={club.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-lg">{club.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>
                      <div className="mt-auto pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{club.memberCount} membre{club.memberCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Aucun club trouvé
              </div>
            )}
          </TabsContent>

          <TabsContent value="lists" className="space-y-6">
            {results.results.bookLists?.data?.length > 0 ? (
              <div className="space-y-4">
                {results.results.bookLists.data.map((list) => (
                  <div key={list.id} className="flex gap-4 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{list.name}</h3>
                      <p className="text-sm text-muted-foreground">{list.description}</p>
                      <p className="text-sm mt-2">
                        {list.bookCount} livre{list.bookCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Aucune liste trouvée
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : query.length >= 2 ? (
        <div className="text-center py-10 text-muted-foreground">
          Aucun résultat trouvé pour "{query}"
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;
