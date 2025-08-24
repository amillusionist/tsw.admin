import { useState } from "react";
import { useLogin } from "react-admin";
import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ username: email, password });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-sm text-gray-500 text-center cursor-pointer" onClick={() => {
            window.location.href = `mailto:${import.meta.env.VITE_ADMIN_EMAIL}`;
          }}>
            Contact Admin for access
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
