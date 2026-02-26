import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Star, ArrowLeft, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">← Back to store</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">{product.rating}</span>
              <span>•</span>
              <span className="capitalize">{product.category}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">${product.original_price.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>
            {product.original_price && (
              <span className="mt-2 inline-block w-fit rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                Save ${(product.original_price - product.price).toFixed(2)}
              </span>
            )}
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center rounded-l-full text-foreground hover:bg-muted transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center rounded-r-full text-foreground hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — ${(product.price * qty).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
