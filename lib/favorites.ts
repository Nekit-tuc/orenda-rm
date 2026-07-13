"use client";

import { useEffect, useState } from "react";

const FAVORITES_KEY = "investal-estate-favorites";

export function getFavoriteIds(): number[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(FAVORITES_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

export function toggleFavoriteId(id: number) {
  const favorites = getFavoriteIds();

  const updatedFavorites = favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

  window.dispatchEvent(new Event("favoritesUpdated"));
}

export function useFavoriteIds() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    function updateFavorites() {
      setFavoriteIds(getFavoriteIds());
    }

    updateFavorites();

    window.addEventListener("favoritesUpdated", updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener("favoritesUpdated", updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  return favoriteIds;
}
