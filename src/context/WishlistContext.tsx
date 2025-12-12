// src/context/WishlistContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Movie } from "../api/tmdb";

export type WishlistItem = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  toggleWishlist: (movie: Movie | WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "wishlist";

function loadWishlistFromStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveWishlistToStorage(list: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

type WishlistProviderProps = {
  children: ReactNode;
};

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() =>
    loadWishlistFromStorage()
  );

  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  const toggleWishlist = (movie: Movie | WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        // 이미 있으면 제거
        return prev.filter((item) => item.id !== movie.id);
      }
      // 없으면 추가
      const newItem: WishlistItem = {
        id: movie.id,
        title: movie.title,
        poster_path:
          "poster_path" in movie ? movie.poster_path ?? null : null,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      };
      return [...prev, newItem];
    });
  };

  const isInWishlist = (id: number) =>
    wishlist.some((item) => item.id === id);

  const value: WishlistContextType = {
  wishlist,
  toggleWishlist,
  isInWishlist,
};

return (
  <WishlistContext.Provider value={value}>
    {children}
  </WishlistContext.Provider>
);

}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist는 WishlistProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
}
