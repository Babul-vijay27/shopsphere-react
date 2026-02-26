import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Address = Tables<"addresses">;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"delivery" | "payment" | "done">("delivery");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const deliveryFee = totalPrice > 35 ? 0 : 4.99;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const loadAddresses = async () => {
      const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id);
      if (data) {
        setAddresses(data);
        const def = data.find((a) => a.is_default);
        if (def) setSelectedAddress(def.id);
      }
    };
    loadAddresses();
  }, [user, navigate]);

  if (items.length === 0 && step !== "done") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">No items to checkout</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">← Back to store</Link>
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
          <p className="mt-2 text-muted-foreground">Your groceries are on the way. Estimated delivery in 45-60 minutes.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/orders" className="rounded-full border border-border px-6 py-3 font-semibold text-foreground hover:bg-muted transition-colors">
              View Orders
            </Link>
            <Link to="/" className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      // Save address if new
      let addressId = selectedAddress;
      if (!addressId && street) {
        const { data: newAddr, error: addrErr } = await supabase.from("addresses").insert({
          user_id: user.id,
          street, city, zip, phone,
          is_default: addresses.length === 0,
        }).select().single();
        if (addrErr) throw addrErr;
        addressId = newAddr.id;
      }

      // Create order
      const total = totalPrice + deliveryFee;
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        user_id: user.id,
        address_id: addressId,
        subtotal: totalPrice,
        delivery_fee: deliveryFee,
        total,
        phone,
        estimated_delivery: "45-60 minutes",
        status: "confirmed",
      }).select().single();
      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      await clearCart();
      setStep("done");
      toast({ title: "Order placed successfully!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

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
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                step === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="h-4 w-4" />{label}
              </div>
            </div>
          ))}
        </div>

        {step === "delivery" && (
          <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Delivery Address</h2>

            {addresses.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Saved addresses</p>
                {addresses.map((a) => (
                  <label key={a.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${selectedAddress === a.id ? "border-primary bg-accent" : "border-border"}`}>
                    <input type="radio" name="address" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="accent-primary" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{a.label}: {a.street}</p>
                      <p className="text-muted-foreground">{a.city}, {a.zip}</p>
                    </div>
                  </label>
                ))}
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${selectedAddress === null ? "border-primary bg-accent" : "border-border"}`}>
                  <input type="radio" name="address" checked={selectedAddress === null} onChange={() => setSelectedAddress(null)} className="accent-primary" />
                  <span className="text-sm font-medium text-foreground">+ New address</span>
                </label>
              </div>
            )}

            {(addresses.length === 0 || selectedAddress === null) && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Street Address</label>
                  <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="123 Main St, Apt 4B" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="New York" required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">ZIP Code</label>
                    <input value={zip} onChange={(e) => setZip(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="10001" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="(555) 123-4567" required />
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-accent p-4 text-sm">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-accent-foreground">Estimated delivery: 45-60 min</p>
                <p className="text-muted-foreground">{deliveryFee === 0 ? "Free delivery!" : `Delivery fee: $${deliveryFee.toFixed(2)}`}</p>
              </div>
            </div>

            <button type="submit" className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Continue to Payment
            </button>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Card Number</label>
              <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="4242 4242 4242 4242" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Expiry</label>
                <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="MM/YY" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">CVC</label>
                <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="123" required />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} items)</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="mt-2 border-t border-border pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span><span>${(totalPrice + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("delivery")} className="flex-1 rounded-full border border-border py-3 font-semibold text-foreground transition-colors hover:bg-muted">
                Back
              </button>
              <button type="submit" disabled={submitting} className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                {submitting ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
