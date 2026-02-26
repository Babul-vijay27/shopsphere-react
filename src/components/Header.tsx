import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Leaf, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">FreshMart</span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-input bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-background"
          />
        </div>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/orders"
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
