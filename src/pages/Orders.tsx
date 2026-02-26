import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Package, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items"> & { products: Tables<"products"> };

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  confirmed: "bg-primary/20 text-primary",
  delivering: "bg-secondary/20 text-secondary",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as any);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">Please log in to view orders</h1>
          <Link to="/login" className="mt-4 text-primary hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>
        <h1 className="mb-8 text-2xl font-bold text-foreground">Your Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
            <h2 className="mt-4 text-xl font-bold text-foreground">No orders yet</h2>
            <Link to="/" className="mt-4 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.products?.image} alt={item.products?.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{item.products?.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                </div>
                {order.estimated_delivery && (
                  <p className="mt-2 text-xs text-primary">Est. delivery: {order.estimated_delivery}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
