import type { AuthContextType } from "@/components/AuthProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopActionResult {
  success: boolean;
  message: string;
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * Returns an error result if the user is not allowed to perform shop actions.
 * Only logged-in users with role "user" are permitted.
 */
function checkAccess(auth: AuthContextType): ShopActionResult | null {
  if (auth.isLoading) {
    return { success: false, message: "Authentication is still loading. Please wait." };
  }
  if (!auth.isAuthenticated) {
    return { success: false, message: "You must be logged in to perform this action." };
  }
  if (!auth.isUser) {
    return {
      success: false,
      message: `Action not allowed for role "${auth.role}". Only regular users can do this.`,
    };
  }
  return null; // access granted
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * Add a product to the cart.
 * Logs the action to the console and returns a result object.
 */
export function addToCart(
  auth: AuthContextType,
  product: { id: string; name: string; price: number; quantity: number }
): ShopActionResult {
  const denied = checkAccess(auth);
  if (denied) {
    console.warn("[Cart] Access denied:", denied.message);
    return denied;
  }

  console.log(
    "%c[Cart] Product Added",
    "background:#4f46e5;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold",
    {
      user: auth.session?.user?.email,
      role: auth.role,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: product.quantity,
      totalCost: (product.price * product.quantity).toFixed(2),
    }
  );

  return { success: true, message: `"${product.name}" (qty: ${product.quantity}) added to cart.` };
}

/**
 * Add a product to the wishlist.
 * Logs the action to the console and returns a result object.
 */
export function addToWishlist(
  auth: AuthContextType,
  product: { id: string; name: string; price: number }
): ShopActionResult {
  const denied = checkAccess(auth);
  if (denied) {
    console.warn("[Wishlist] Access denied:", denied.message);
    return denied;
  }

  console.log(
    "%c[Wishlist] Product Added",
    "background:#f43f5e;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold",
    {
      user: auth.session?.user?.email,
      role: auth.role,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    }
  );

  return { success: true, message: `"${product.name}" added to wishlist.` };
}

/**
 * Move a wishlisted product directly into the cart.
 * Removes it from the wishlist and adds it to the cart in one action.
 */
export function moveWishlistToCart(
  auth: AuthContextType,
  product: { id: string; name: string; price: number; quantity: number }
): ShopActionResult {
  const denied = checkAccess(auth);
  if (denied) {
    console.warn("[Wishlist→Cart] Access denied:", denied.message);
    return denied;
  }

  console.log(
    "%c[Wishlist→Cart] Product Moved",
    "background:#059669;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold",
    {
      user: auth.session?.user?.email,
      role: auth.role,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: product.quantity,
      totalCost: (product.price * product.quantity).toFixed(2),
    }
  );

  return { success: true, message: `"${product.name}" moved from wishlist to cart.` };
}

/**
 * Remove a product from the cart.
 */
export function removeFromCart(
  auth: AuthContextType,
  product: { id: string; name: string }
): ShopActionResult {
  const denied = checkAccess(auth);
  if (denied) {
    console.warn("[Cart] Access denied:", denied.message);
    return denied;
  }

  console.log(
    "%c[Cart] Product Removed",
    "background:#6b7280;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold",
    { user: auth.session?.user?.email, role: auth.role, product }
  );

  return { success: true, message: `Product "${product.name}" removed from cart.` };
}

/**
 * Remove a product from the wishlist.
 */
export function removeFromWishlist(
  auth: AuthContextType,
  product: { id: string; name: string }
): ShopActionResult {
  const denied = checkAccess(auth);
  if (denied) {
    console.warn("[Wishlist] Access denied:", denied.message);
    return denied;
  }

  console.log(
    "%c[Wishlist] Product Removed",
    "background:#6b7280;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold",
    { user: auth.session?.user?.email, role: auth.role, product }
  );

  return { success: true, message: `Product "${product.name}" removed from wishlist.` };
}
