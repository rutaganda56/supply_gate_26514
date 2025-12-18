"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Package, Store, Folder, CheckSquare, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { globalSearchApi } from "@/app/lib/api";

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: "product" | "store" | "category" | "verification" | "message";
  url: string;
  metadata: string;
}

interface GlobalSearchResults {
  products: SearchResultItem[];
  stores: SearchResultItem[];
  categories: SearchResultItem[];
  verifications: SearchResultItem[];
  messages: SearchResultItem[];
  totalResults: number;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use the API helper which handles authentication automatically
        const { globalSearchApi } = await import("@/app/lib/api");
        const data = await globalSearchApi.search(searchQuery, 5);
        // Type assertion to match the expected interface
        setResults(data as GlobalSearchResults);

      } catch (error) {
        console.error("Search error:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change
  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
      setIsOpen(true);
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [query, debouncedSearch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.totalResults === 0) return;

    const allResults = [
      ...results.products,
      ...results.stores,
      ...results.categories,
      ...results.verifications,
      ...results.messages,
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = allResults[selectedIndex];
      if (selected) {
        handleResultClick(selected);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (result: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    router.push(result.url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="w-4 h-4" />;
      case "store":
        return <Store className="w-4 h-4" />;
      case "category":
        return <Folder className="w-4 h-4" />;
      case "verification":
        return <CheckSquare className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Product";
      case "store":
        return "Store";
      case "category":
        return "Category";
      case "verification":
        return "Verification";
      case "message":
        return "Message";
      default:
        return "Result";
    }
  };

  const allResults = results
    ? [
        ...results.products,
        ...results.stores,
        ...results.categories,
        ...results.verifications,
        ...results.messages,
      ]
    : [];

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, stores, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results && results.totalResults > 0 ? (
            <div className="py-2">
              {/* Products */}
              {results.products.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Products</h3>
                    <span className="text-xs text-gray-400">({results.products.length})</span>
                  </div>
                  {results.products.map((item, idx) => {
                    const globalIdx = idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3",
                          selectedIndex === globalIdx && "bg-gray-50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                          )}
                          {item.metadata && (
                            <p className="text-xs text-gray-400 mt-1">{item.metadata}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Stores */}
              {results.stores.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Stores</h3>
                    <span className="text-xs text-gray-400">({results.stores.length})</span>
                  </div>
                  {results.stores.map((item, idx) => {
                    const globalIdx = results.products.length + idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3",
                          selectedIndex === globalIdx && "bg-gray-50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                          )}
                          {item.metadata && (
                            <p className="text-xs text-gray-400 mt-1">{item.metadata}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Categories</h3>
                    <span className="text-xs text-gray-400">({results.categories.length})</span>
                  </div>
                  {results.categories.map((item, idx) => {
                    const globalIdx = results.products.length + results.stores.length + idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3",
                          selectedIndex === globalIdx && "bg-gray-50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Verifications */}
              {results.verifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Verifications</h3>
                    <span className="text-xs text-gray-400">({results.verifications.length})</span>
                  </div>
                  {results.verifications.map((item, idx) => {
                    const globalIdx = results.products.length + results.stores.length + results.categories.length + idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3",
                          selectedIndex === globalIdx && "bg-gray-50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                          )}
                          {item.metadata && (
                            <p className="text-xs text-gray-400 mt-1">{item.metadata}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Messages */}
              {results.messages.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Messages</h3>
                    <span className="text-xs text-gray-400">({results.messages.length})</span>
                  </div>
                  {results.messages.map((item, idx) => {
                    const globalIdx = results.products.length + results.stores.length + results.categories.length + results.verifications.length + idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-start gap-3",
                          selectedIndex === globalIdx && "bg-gray-50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                          )}
                          {item.metadata && (
                            <p className="text-xs text-gray-400 mt-1">{item.metadata}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  {results.totalResults} result{results.totalResults !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
