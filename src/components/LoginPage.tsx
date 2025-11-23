import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface LoginPageProps {
  onLogin: (userType: "admin" | "trainee", email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple authentication logic
    if (email === "admin@ncbwqueencity.org" && password === "admin123") {
      onLogin("admin", email);
    } else if (email === "trainee@ncbwqueencity.org" && password === "trainee123") {
      onLogin("trainee", email);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <Card className="w-full max-w-md border-2 border-[#c6930a]">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 bg-[#c6930a] rounded-full flex items-center justify-center mb-2">
            <span className="text-3xl">👑</span>
          </div>
          <CardTitle className="text-2xl">NCBW Queen City</CardTitle>
          <CardDescription>Leadership Training Dashboard</CardDescription>
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#c6930a] hover:bg-[#a37808]">
              Sign In
            </Button>
            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p className="font-semibold">Demo Credentials:</p>
              <p>Admin: admin@ncbwqueencity.org / admin123</p>
              <p>Trainee: trainee@ncbwqueencity.org / trainee123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
