
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const API_WISHLIST =
    "https://halal-marketplace.onrender.com/products/wishlist/";

  const loadWishlist = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await fetch(API_WISHLIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setWishlist([]);
        return;
      }

      const data = await res.json();

      setWishlist(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.log(err);
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () =>
  useContext(WishlistContext);