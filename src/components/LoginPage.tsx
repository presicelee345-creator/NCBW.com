import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface LoginPageProps {
  onLogin: (userType: "admin" | "trainee", email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isCreatingAccount) {
      // Validate password requirements
      if (!isPasswordValid) {
        setError("Please meet all password requirements");
        return;
      }
      if (!passwordsMatch) {
        setError("Passwords do not match");
        return;
      }
      // In a real app, this would create the account
      setError("Account creation successful! Please log in.");
      setIsCreatingAccount(false);
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // Login logic - determine user type based on credentials
    if (email === "admin@ncbwqueencity.org" && password === "admin123") {
      onLogin("admin", email);
    } else if (email === "trainee@ncbwqueencity.org" && password === "trainee123") {
      onLogin("trainee", email);
    } else {
      setError("Invalid email or password");
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? "text-green-600" : "text-gray-500"}`}>
      {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isCreatingAccount && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Password Requirements:</p>
                  <ValidationItem isValid={hasMinLength} text="At least 8 characters" />
                  <ValidationItem isValid={hasUpperCase} text="One uppercase letter (A-Z)" />
                  <ValidationItem isValid={hasLowerCase} text="One lowercase letter (a-z)" />
                  <ValidationItem isValid={hasNumber} text="One number (0-9)" />
                  <ValidationItem isValid={hasSpecialChar} text="One special character (!@#$%^&*)" />
                  {confirmPassword && (
                    <ValidationItem isValid={passwordsMatch} text="Passwords match" />
                  )}
                </div>
              </>
            )}

            {!isCreatingAccount && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}

            {error && (
              <p className={`text-sm ${error.includes("successful") ? "text-green-600" : "text-red-500"}`}>
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-[#c6930a] hover:bg-[#a37808]">
              {isCreatingAccount ? "Create Account" : "Sign In"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingAccount(!isCreatingAccount);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-[#c6930a] hover:text-[#a37808] font-medium"
              >
                {isCreatingAccount ? "Already have an account? Sign in" : "Create new account"}
              </button>
            </div>

            {!isCreatingAccount && (
              <div className="text-xs text-gray-500 mt-4 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-700">Demo Credentials:</p>
                <div>
                  <p className="font-medium text-gray-800">Admin:</p>
                  <p>admin@ncbwqueencity.org / admin123</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Trainee:</p>
                  <p>trainee@ncbwqueencity.org / trainee123</p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}