import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"delivery" | "payment" | "done">("delivery");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const deliveryFee = totalPrice > 35 ? 0 : 4.99;

  if (items.length === 0 && step !== "done") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">No items to checkout</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <CheckCircle className="h-20 w-20 text-success" />
          <h1 className="mt-6 text-3xl font-bold text-foreground">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your groceries are on the way. Estimated delivery in 45-60 minutes.
          </p>
          <Link
            to="/"
            className="mt-8 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[
            { key: "delivery", label: "Delivery", icon: MapPin },
            { key: "payment", label: "Payment", icon: CreditCard },
          ].map(({ key, label, icon: Icon }, idx) => (
            <div key={key} className="flex items-center gap-2">
              {idx > 0 && <div className="h-px w-12 bg-border" />}
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  step === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </div>
          ))}
        </div>

        {step === "delivery" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep("payment");
            }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-foreground">Delivery Address</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Street Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="123 Main St, Apt 4B"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  ZIP Code
                </label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="10001"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-accent p-4 text-sm">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-accent-foreground">Estimated delivery: 45-60 min</p>
                <p className="text-muted-foreground">
                  {deliveryFee === 0 ? "Free delivery!" : `Delivery fee: $${deliveryFee.toFixed(2)}`}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {step === "payment" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clearCart();
              setStep("done");
            }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Card Number
              </label>
              <input
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="4242 4242 4242 4242"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Expiry</label>
                <input
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CVC</label>
                <input
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="mt-2 border-t border-border pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>${(totalPrice + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("delivery")}
                className="flex-1 rounded-full border border-border py-3 font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Place Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
