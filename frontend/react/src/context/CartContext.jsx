import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // ✅ connect auth

const CartContext = createContext();

export function CartProvider({ children }) {
  const { auth } = useAuth(); // ✅ listen to login/logout
  
  
  const [cartCount, setCartCount] = useState(0);

  const API_CART =   "https://halal-marketplace.onrender.com/products/cart/"; // ✅ FIXED URL

  /* 🔄 Load cart */
  const loadCart = async () => {
    if (!auth.access) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(API_CART, {
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      });

      if (!res.ok) {
        setCartCount(0);
        return;
      }

      const data = await res.json();

      const items = Array.isArray(data) ? data : data.results || [];

      // ✅ FIX: correct count (sum of quantity)
      const totalCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalCount);

    } catch (err) {
      console.log("Cart error:", err);
      setCartCount(0);
    }
  };

  /* ✅ IMPORTANT: reload when login/logout changes */
  useEffect(() => {
    loadCart();
  }, [auth.access]);

  return (
    <CartContext.Provider value={{ cartCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

/* Hook */
export const useCart = () => useContext(CartContext);