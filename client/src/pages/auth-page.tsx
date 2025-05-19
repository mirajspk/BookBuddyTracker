import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Component types
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Forgot password form setup
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    console.log("Login data:", data);
    // TODO: Implement actual login logic

    // For now, show success toast and redirect
    toast({
      title: "Login successful",
      description: "Welcome back to BookTrack!",
    });
    toast({
      title: "Security Alert",
      description: "A login to your profile has just occurred. If this wasn't you, please change your password immediately.",
      variant: "destructive"
    });
    window.location.href = "/"; // Redirect to dashboard
  };

  // Register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    console.log("Register data:", data);
    // TODO: Implement actual registration logic
    
    toast({
      title: "Registration successful",
      description: "Your account has been created. Please log in.",
    });
    
    setActiveTab("login");
  };

  // Forgot password form submission
  const onForgotPasswordSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Forgot password data:", data);
    // TODO: Implement actual password reset logic
    
    toast({
      title: "Password reset email sent",
      description: `Check ${data.email} for instructions to reset your password.`,
    });
    
    setShowForgotPassword(false);
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - Hero/Branding section */}
      <div className="bg-gradient-to-br from-primary/90 to-primary/50 text-white md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="mb-6 flex items-center">
          <BookOpen className="h-10 w-10 mr-2" />
          <h1 className="text-3xl font-bold">BookTrack</h1>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your personal library, <br />in your pocket.
        </h2>
        <p className="text-lg mb-8 max-w-lg">
          Track your reading, manage your collection, write reviews, and discover your next favorite book.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <BookText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-white/80">Log your reading sessions and see your progress.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Build Your Library</h3>
              <p className="text-sm text-white/80">Organize books into collections and wishlists.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Auth forms */}
      <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          {showForgotPassword ? (
            <Card>
              <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...forgotPasswordForm.register("email")}
                    />
                    {forgotPasswordForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {forgotPasswordForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          {...loginForm.register("username")}
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-xs"
                            onClick={() => setShowForgotPassword(true)}
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          {...loginForm.register("password")}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                      Start your reading journey with BookTrack
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-username">Username</Label>
                        <Input
                          id="reg-username"
                          type="text"
                          placeholder="Choose a username"
                          {...registerForm.register("username")}
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="you@example.com"
                          {...registerForm.register("email")}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          {...registerForm.register("password")}
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                        <Input
                          id="reg-confirm-password"
                          type="password"
                          placeholder="••••••••"
                          {...registerForm.register("confirmPassword")}
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}