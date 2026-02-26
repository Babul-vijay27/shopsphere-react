import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await resetPassword(email);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          {sent ? (
            <>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="mt-2 text-muted-foreground">We sent a password reset link to {email}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="you@example.com"
                  required
                />
                <button type="submit" className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Send reset link
                </button>
              </form>
            </>
          )}
          <Link to="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
