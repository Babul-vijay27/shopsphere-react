import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-grocery.png";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: products = [], isLoading } = useProducts(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Fresh groceries" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/30" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-background md:text-5xl">
              Fresh Groceries,
              <br />
              <span className="text-secondary">Delivered Fast</span>
            </h1>
            <p className="mt-4 text-lg text-background/80">
              Shop from hundreds of fresh products and get them delivered to your doorstep in under an hour.
            </p>
            <Link
              to="#products"
              className="mt-6 inline-flex rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              !activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container mx-auto px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          {activeCategory ? categories.find((c) => c.id === activeCategory)?.name : "All Products"}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 FreshMart. Fresh groceries delivered to your door.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
