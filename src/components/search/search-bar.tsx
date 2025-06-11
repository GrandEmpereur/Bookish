"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, User, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions?: string[];
  loading?: boolean;
  placeholder?: string;
  className?: string;
  recentSearches?: Array<{
    id: string;
    text: string;
    type: "user" | "hashtag" | "general";
    avatar?: string;
  }>;
  onSearchSubmit?: (query: string) => void;
}

export const SearchBar = ({
  query,
  onQueryChange,
  suggestions = [],
  loading = false,
  placeholder = "Rechercher",
  className,
  recentSearches = [],
  onSearchSubmit,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<
    Array<{
      id: string;
      text: string;
      type: "user" | "hashtag" | "general";
      timestamp: number;
    }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem("instagram-search-history");
      if (history) {
        const parsed = JSON.parse(history);
        setSearchHistory(parsed.slice(0, 20)); // Limiter à 20 éléments comme Instagram
      }
    } catch (error) {
      // Erreur lors du chargement de l'historique, ignorer silencieusement
    }
  }, []);

  // Sauvegarder dans l'historique
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    try {
      const searchType: "user" | "hashtag" | "general" = searchQuery.startsWith(
        "@"
      )
        ? "user"
        : searchQuery.startsWith("#")
          ? "hashtag"
          : "general";

      const newEntry = {
        id: Date.now().toString(),
        text: searchQuery,
        type: searchType,
        timestamp: Date.now(),
      };

      const filteredHistory = searchHistory.filter(
        (item) => item.text !== searchQuery
      );
      const newHistory = [newEntry, ...filteredHistory].slice(0, 20);

      setSearchHistory(newHistory);
      localStorage.setItem(
        "instagram-search-history",
        JSON.stringify(newHistory)
      );
    } catch (error) {
      // Erreur lors de la sauvegarde, ignorer silencieusement
    }
  };

  // Supprimer un élément de l'historique
  const removeFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newHistory = searchHistory.filter((item) => item.id !== id);
      setSearchHistory(newHistory);
      localStorage.setItem(
        "instagram-search-history",
        JSON.stringify(newHistory)
      );
    } catch (error) {
      // Erreur lors de la suppression, ignorer silencieusement
    }
  };

  // Vider tout l'historique
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("instagram-search-history");
  };

  // Gérer les clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query);
      setShowDropdown(false);
      setIsFocused(false);
      inputRef.current?.blur();
      onSearchSubmit?.(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    saveToHistory(suggestion);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
    onSearchSubmit?.(suggestion);
  };

  const clearQuery = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const hasContent =
    query.length > 0 || searchHistory.length > 0 || suggestions.length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative flex items-center transition-all duration-200",
            "bg-gray-100 dark:bg-gray-800",
            "rounded-xl",
            "border border-transparent",
            isFocused &&
              "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 shadow-sm"
          )}
        >
          <Search
            className={cn(
              "absolute left-4 h-4 w-4 transition-colors",
              isFocused
                ? "text-gray-600 dark:text-gray-400"
                : "text-gray-500 dark:text-gray-500"
            )}
          />

          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn(
              "pl-12 pr-10 py-2 h-10",
              "bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-gray-500 dark:placeholder:text-gray-500",
              "text-sm font-normal"
            )}
          />

          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          )}

          {loading && (
            <div className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          )}
        </div>
      </form>

      {/* Dropdown des suggestions/historique style Instagram */}
      {showDropdown && hasContent && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-[400px] overflow-y-auto">
          {/* Suggestions en temps réel */}
          {query.length > 0 && suggestions.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Recherches récentes */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div>
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Recherches récentes
                </span>
                <button
                  onClick={clearAllHistory}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  Tout effacer
                </button>
              </div>

              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                >
                  <button
                    onClick={() => handleSuggestionClick(item.text)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {item.type === "user" && (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                      {item.type === "hashtag" && (
                        <Hash className="h-4 w-4 text-gray-500" />
                      )}
                      {item.type === "general" && (
                        <Clock className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {item.text}
                    </span>
                  </button>

                  <button
                    onClick={(e) => removeFromHistory(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Message quand pas de contenu */}
          {query.length === 0 &&
            searchHistory.length === 0 &&
            suggestions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">Aucune recherche récente.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
