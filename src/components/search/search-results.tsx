"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Book as BookIcon,
  Users,
  Heart,
  BookOpen,
  Star,
  Calendar,
  User,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Book } from "@/types/bookTypes";
import { Club } from "@/types/clubTypes";
import { UserProfile } from "@/types/userTypes";
import { BookList } from "@/types/bookListTypes";
import { SearchCategory } from "@/types/searchTypes";

interface SearchResultsProps {
  results: any;
  category: SearchCategory;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  totalResults?: number;
}

export const SearchResults = ({
  results,
  category,
  loading = false,
  onLoadMore,
  hasMore = false,
  totalResults = 0,
}: SearchResultsProps) => {
  const router = useRouter();

  if (loading && !results) {
    return <SearchResultsSkeleton />;
  }

  // Pour la recherche générale, vérifier si on a des résultats
  if (category === "all") {
    if (!results || !results.results) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Aucun résultat trouvé
          </h3>
          <p className="text-sm text-muted-foreground">
            Essayez avec d'autres mots-clés ou modifiez vos filtres
          </p>
        </div>
      );
    }

    // Vérifier si on a au moins un résultat dans une catégorie
    const hasResults =
      results.results?.users?.data?.length > 0 ||
      results.results?.books?.data?.length > 0 ||
      results.results?.clubs?.data?.length > 0 ||
      results.results?.book_lists?.data?.length > 0;

    if (!hasResults) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Aucun résultat trouvé
          </h3>
          <p className="text-sm text-muted-foreground">
            Essayez avec d'autres mots-clés ou modifiez vos filtres
          </p>
        </div>
      );
    }
  } else {
    // Pour les recherches spécifiques
    if (!results || (Array.isArray(results) && results.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Aucun résultat trouvé
          </h3>
          <p className="text-sm text-muted-foreground">
            {`Aucun ${CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.label.toLowerCase()} trouvé pour cette recherche`}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Essayez de rechercher dans "Tout" pour voir plus de résultats
          </p>
        </div>
      );
    }
  }

  const renderResults = () => {
    switch (category) {
      case "all":
        return renderAllResults();
      case "users":
        const users = Array.isArray(results) ? results : [];
        return renderUsers(users);
      case "books":
        const books = Array.isArray(results) ? results : [];
        return renderBooks(books);
      case "clubs":
        const clubs = Array.isArray(results) ? results : [];
        return renderClubs(clubs);
      case "book_lists":
        const bookLists = Array.isArray(results) ? results : [];
        return renderBookLists(bookLists);
      default:
        return null;
    }
  };

  const renderAllResults = () => {
    if (!results?.results) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Aucun résultat trouvé
          </h3>
          <p className="text-sm text-muted-foreground">
            Essayez avec d'autres mots-clés ou modifiez vos filtres
          </p>
        </div>
      );
    }

    const { results: data } = results;

    return (
      <div className="space-y-8">
        {/* Utilisateurs */}
        {data?.users?.data?.length > 0 && (
          <ResultSection
            title="Utilisateurs"
            count={data.users.total || data.users.data.length}
            onViewAll={() => router.push("/search?category=users")}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.users.data.slice(0, 6).map((user: UserProfile) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* Livres */}
        {data?.books?.data?.length > 0 && (
          <ResultSection
            title="Livres"
            count={data.books.total || data.books.data.length}
            onViewAll={() => router.push("/search?category=books")}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.books.data.slice(0, 8).map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* Clubs */}
        {data?.clubs?.data?.length > 0 && (
          <ResultSection
            title="Clubs"
            count={data.clubs.total || data.clubs.data.length}
            onViewAll={() => router.push("/search?category=clubs")}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.clubs.data.slice(0, 6).map((club: Club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* Listes de lecture */}
        {data?.book_lists?.data?.length > 0 && (
          <ResultSection
            title="Listes de lecture"
            count={data.book_lists.total || data.book_lists.data.length}
            onViewAll={() => router.push("/search?category=book_lists")}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.book_lists.data.slice(0, 6).map((list: BookList) => (
                <BookListCard key={list.id} bookList={list} />
              ))}
            </div>
          </ResultSection>
        )}

        {/* Message si aucun résultat dans aucune catégorie */}
        {!data?.users?.data?.length &&
          !data?.books?.data?.length &&
          !data?.clubs?.data?.length &&
          !data?.book_lists?.data?.length && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Aucun résultat trouvé
              </h3>
              <p className="text-sm text-muted-foreground">
                Essayez avec d'autres mots-clés ou modifiez vos filtres
              </p>
            </div>
          )}
      </div>
    );
  };

  const renderUsers = (users: UserProfile[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  const renderBooks = (books: Book[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );

  const renderClubs = (clubs: Club[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );

  const renderBookLists = (lists: BookList[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <BookListCard key={list.id} bookList={list} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderResults()}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Chargement...
              </>
            ) : (
              "Voir plus"
            )}
          </Button>
        </div>
      )}

      {/* Indicateur de chargement global */}
      {loading && !hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Recherche en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Composants de carte spécialisés
const UserCard = ({ user }: { user: UserProfile }) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => router.push(`/profile/${user.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profile?.profile_picture_url || undefined} />
            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.username}</p>
            {user.profile?.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.profile.bio}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {user.profile?.role || "Utilisateur"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => router.push(`/books/${book.id}`)}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                      {book.cover_image ? (
              <Image
                src={book.cover_image}
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
        <div className="p-3 space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
          <p className="text-xs text-muted-foreground">{book.author}</p>
          {book.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{book.rating}</span>
            </div>
          )}
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ClubCard = ({ club }: { club: Club }) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => router.push(`/clubs/${club.id}`)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-2">{club.name}</h3>
            <Badge variant="outline" className="text-xs">
              {club.type || "Public"}
            </Badge>
          </div>

          {club.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {club.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{club.member_count || 0} membres</span>
            </div>
            {club.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(club.created_at).getFullYear()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookListCard = ({ bookList }: { bookList: BookList }) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => router.push(`/library/${bookList.id}`)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-2">{bookList.name}</h3>
            <Badge variant="outline" className="text-xs">
              {bookList.visibility || "Publique"}
            </Badge>
          </div>

          {bookList.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bookList.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{bookList.book_count || 0} livres</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{(bookList as any).user?.username || "Anonyme"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ResultSection = ({
  title,
  count,
  onViewAll,
  children,
}: {
  title: string;
  count: number;
  onViewAll: () => void;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        {title} <span className="text-muted-foreground">({count})</span>
      </h2>
      <Button variant="ghost" size="sm" onClick={onViewAll}>
        Voir tout
        <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    </div>
    {children}
  </div>
);

const SearchResultsSkeleton = () => (
  <div className="space-y-8">
    {[1, 2, 3].map((section) => (
      <div key={section} className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Constante pour les labels
const CATEGORY_INFO = {
  all: { label: "Tout" },
  users: { label: "Utilisateurs" },
  books: { label: "Livres" },
  clubs: { label: "Clubs" },
  book_lists: { label: "Listes" },
};
