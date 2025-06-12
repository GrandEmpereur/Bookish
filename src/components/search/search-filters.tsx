"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X, RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchCategory } from "@/types/searchTypes";

interface SearchFiltersProps {
  category: SearchCategory;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  className?: string;
}

const GENRES = [
  "fantasy",
  "romance",
  "science-fiction",
  "thriller",
  "mystery",
  "historical",
  "contemporary",
  "horror",
  "adventure",
  "biography",
  "non-fiction",
  "young-adult",
  "children",
  "classic",
  "poetry",
];

const USER_ROLES = [
  { value: "USER", label: "Utilisateur" },
  { value: "AUTHOR", label: "Auteur" },
  { value: "PUBLISHER", label: "Éditeur" },
  { value: "MODERATOR", label: "Modérateur" },
];

const BOOK_FORMATS = [
  { value: "paperback", label: "Livre papier" },
  { value: "ebook", label: "Livre numérique" },
  { value: "audiobook", label: "Livre audio" },
];

const SORT_OPTIONS: Record<
  SearchCategory,
  Array<{ value: string; label: string }>
> = {
  all: [
    { value: "relevance", label: "Pertinence" },
    { value: "date", label: "Date" },
  ],
  users: [
    { value: "relevance", label: "Pertinence" },
    { value: "registration_date", label: "Date d'inscription" },
    { value: "username", label: "Nom d'utilisateur" },
  ],
  books: [
    { value: "relevance", label: "Pertinence" },
    { value: "publication_date", label: "Date de publication" },
    { value: "title", label: "Titre" },
    { value: "rating", label: "Note" },
  ],
  clubs: [
    { value: "relevance", label: "Pertinence" },
    { value: "member_count", label: "Nombre de membres" },
    { value: "creation_date", label: "Date de création" },
  ],
  book_lists: [
    { value: "relevance", label: "Pertinence" },
    { value: "book_count", label: "Nombre de livres" },
    { value: "creation_date", label: "Date de création" },
  ],
};

export const SearchFilters = ({
  category,
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Synchroniser tempFilters avec filters
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const updateTempFilter = (key: string, value: any) => {
    setTempFilters((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value === "" || value === undefined ? undefined : value,
      },
    }));
  };

  const applyFilters = () => {
    const cleanedFilters = { ...tempFilters };
    if (cleanedFilters[category]) {
      Object.keys(cleanedFilters[category]).forEach((key) => {
        if (
          cleanedFilters[category][key] === undefined ||
          cleanedFilters[category][key] === "" ||
          (Array.isArray(cleanedFilters[category][key]) &&
            cleanedFilters[category][key].length === 0)
        ) {
          delete cleanedFilters[category][key];
        }
      });
    }
    onFiltersChange(cleanedFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const emptyFilters = { category };
    setTempFilters(emptyFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    const categoryFilters = filters[category] || {};
    return Object.keys(categoryFilters).filter((key) => {
      const value = categoryFilters[key];
      return (
        value !== undefined &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0)
      );
    }).length;
  };

  const renderGenreFilter = () => (
    <div className="space-y-3">
      <Label>Genres</Label>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => {
          const isSelected = tempFilters[category]?.genres?.includes(genre);
          return (
            <Badge
              key={genre}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => {
                const currentGenres = tempFilters[category]?.genres || [];
                const newGenres = isSelected
                  ? currentGenres.filter((g: string) => g !== genre)
                  : [...currentGenres, genre];
                updateTempFilter("genres", newGenres);
              }}
            >
              {genre}
              {isSelected && <X className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );

  const renderUserFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Rôle</Label>
        <Select
          value={tempFilters[category]?.role || ""}
          onValueChange={(value) =>
            updateTempFilter("role", value || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les rôles</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Localisation</Label>
        <Input
          placeholder="Ville, pays..."
          value={tempFilters[category]?.location || ""}
          onChange={(e) => updateTempFilter("location", e.target.value)}
        />
      </div>

      {renderGenreFilter()}
    </>
  );

  const renderBookFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Auteur</Label>
        <Input
          placeholder="Nom de l'auteur"
          value={tempFilters[category]?.author || ""}
          onChange={(e) => updateTempFilter("author", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label>Format</Label>
        <Select
          value={tempFilters[category]?.format || ""}
          onValueChange={(value) =>
            updateTempFilter("format", value || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les formats</SelectItem>
            {BOOK_FORMATS.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Année de publication</Label>
        <Input
          type="number"
          placeholder="2023"
          value={tempFilters[category]?.publication_year || ""}
          onChange={(e) =>
            updateTempFilter(
              "publication_year",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
        />
      </div>

      <div className="space-y-3">
        <Label>
          Note minimale ({tempFilters[category]?.rating_min || 0}/5)
        </Label>
        <Slider
          value={[tempFilters[category]?.rating_min || 0]}
          onValueChange={([value]) => updateTempFilter("rating_min", value)}
          max={5}
          step={0.5}
          className="w-full"
        />
      </div>

      {renderGenreFilter()}
    </>
  );

  const renderClubFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Visibilité</Label>
        <Select
          value={tempFilters[category]?.visibility || ""}
          onValueChange={(value) =>
            updateTempFilter("visibility", value || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les visibilités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Privé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Nombre de membres minimum</Label>
        <Input
          type="number"
          placeholder="5"
          value={tempFilters[category]?.member_count_min || ""}
          onChange={(e) =>
            updateTempFilter(
              "member_count_min",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
        />
      </div>

      {renderGenreFilter()}
    </>
  );

  const renderListFilters = () => (
    <>
      <div className="space-y-3">
        <Label>Visibilité</Label>
        <Select
          value={tempFilters[category]?.visibility || ""}
          onValueChange={(value) =>
            updateTempFilter("visibility", value || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les visibilités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            <SelectItem value="public">Publique</SelectItem>
            <SelectItem value="private">Privée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Nombre de livres minimum</Label>
        <Input
          type="number"
          placeholder="5"
          value={tempFilters[category]?.book_count || ""}
          onChange={(e) =>
            updateTempFilter(
              "book_count",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
        />
      </div>

      {renderGenreFilter()}
    </>
  );

  const renderSortFilter = () => {
    const sortOptions = SORT_OPTIONS[category] || SORT_OPTIONS.all;

    return (
      <div className="space-y-3">
        <Label>Trier par</Label>
        <Select
          value={tempFilters[category]?.sort_by || "relevance"}
          onValueChange={(value) => updateTempFilter("sort_by", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderCategoryFilters = () => {
    switch (category) {
      case "users":
        return renderUserFilters();
      case "books":
        return renderBookFilters();
      case "clubs":
        return renderClubFilters();
      case "book_lists":
        return renderListFilters();
      default:
        return null;
    }
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("relative", className)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {activeCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Tri */}
          <Accordion type="single" defaultValue="sort" collapsible>
            <AccordionItem value="sort">
              <AccordionTrigger className="text-sm font-medium">
                Tri et ordre
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderSortFilter()}

                <div className="space-y-3">
                  <Label>Ordre</Label>
                  <Select
                    value={tempFilters[category]?.order || "desc"}
                    onValueChange={(value) => updateTempFilter("order", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Décroissant</SelectItem>
                      <SelectItem value="asc">Croissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Filtres spécifiques par catégorie */}
          {category !== "all" && (
            <Accordion type="single" defaultValue="specific" collapsible>
              <AccordionItem value="specific">
                <AccordionTrigger className="text-sm font-medium">
                  Filtres spécifiques
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {renderCategoryFilters()}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Appliquer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
