"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Product } from "@/models/Products";
import { useSession } from "next-auth/react";


interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [dbHydrated, setDbHydrated] = useState(false);
  const isInitialMount = useRef(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch all products once for hydration
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const isAuthenticated = status === "authenticated";

  // 1. Initial Load Logic
  useEffect(() => {
    const loadState = async () => {
      if (allProducts.length === 0) return;

      const savedCart = localStorage.getItem("sca-cart");
      const savedWishlist = localStorage.getItem("sca-wishlist");
      
      let localCart = savedCart ? JSON.parse(savedCart) : [];
      let localWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

      if (status === "authenticated") {
        try {
          // Sync Cart
          const cartRes = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localItems: localCart }),
          });
          const dbCartItems = await cartRes.json();
          
          if (Array.isArray(dbCartItems)) {
            const hydratedCart = dbCartItems.map((item: any) => {
              const product = allProducts.find(p => p.id === item.productId);
              return product ? { ...product, quantity: item.quantity } : null;
            }).filter(Boolean) as CartItem[];
            setCart(hydratedCart);
          }

          // Sync Wishlist
          const wishlistRes = await fetch("/api/wishlist/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localItems: localWishlist }),
          });
          const dbWishlistIds = await wishlistRes.json();
          
          if (Array.isArray(dbWishlistIds)) {
            const hydratedWishlist = dbWishlistIds.map((pId: string) => 
              allProducts.find(p => p.id === pId)
            ).filter(Boolean) as Product[];
            setWishlist(hydratedWishlist);
          }
          
          // Clear LocalStorage after successful merge
          localStorage.removeItem("sca-cart");
          localStorage.removeItem("sca-wishlist");
          setDbHydrated(true);
        } catch (error) {
          console.error("Sync error:", error);
        }
      } else if (status === "unauthenticated") {
        setCart(localCart);
        setWishlist(localWishlist);
        setDbHydrated(true);
      }
    };

    if (status !== "loading") {
      loadState();
    }
  }, [status, allProducts]);

  // 2. Persistance Logic
  useEffect(() => {
    if (!dbHydrated) return;

    if (status === "unauthenticated") {
      localStorage.setItem("sca-cart", JSON.stringify(cart));
      localStorage.setItem("sca-wishlist", JSON.stringify(wishlist));
    } else if (status === "authenticated" && !isInitialMount.current) {
        // Debounced update would be better, but for now simple fetch
        fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                items: cart.map(i => ({ productId: i.id, quantity: i.quantity })) 
            }),
        });
    }
  }, [cart, wishlist, status, dbHydrated]);

  // Handle initial mount ref
  useEffect(() => {
    isInitialMount.current = false;
  }, []);



  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const toggleWishlist = (product: Product) => {
    const isRemove = wishlist.some((item) => item.id === product.id);
    
    setWishlist((prev) =>
      isRemove
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );

    if (isAuthenticated) {
        if (isRemove) {
            fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
        } else {
            fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
        }
    }
  };



  const clearCart = () => setCart([]);

  const cartCount = cart.length;
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);


  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
