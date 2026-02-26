import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some fresh products to get started</p>
          <Link to="/" className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = totalPrice > 35 ? 0 : 4.99;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <h1 className="mb-8 text-2xl font-bold text-foreground">Shopping Cart ({totalItems} items)</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-card-foreground hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)} / {product.unit}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-l-full text-foreground hover:bg-muted transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-r-full text-foreground hover:bg-muted transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">${(product.price * quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-card-foreground">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-primary">Add ${(35 - totalPrice).toFixed(2)} more for free delivery</p>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total</span><span>${(totalPrice + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </div>
            {user ? (
              <Link to="/checkout" className="mt-6 block w-full rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Proceed to Checkout
              </Link>
            ) : (
              <Link to="/login" className="mt-6 block w-full rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Login to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
