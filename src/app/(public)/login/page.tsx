"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { useLogin } from "@/hooks/use-auth";
import { LoginFormData, loginSchema } from "@/schemas/auth.schema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const defaultEmail = env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL || "admin@example.com";
  const defaultPassword = env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || "AdminPassword123!";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleFillDemo = () => {
    setValue("email", defaultEmail, { shouldValidate: true });
    setValue("password", defaultPassword, { shouldValidate: true });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-6 md:p-8">
      {/* Background glowing ambiance */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[450px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20" />
        <div className="h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/15" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/10 transition-transform duration-300 hover:scale-105">
            <Activity className="size-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            CoreFit Health
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin Dashboard & Operations Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Admin Sign In</CardTitle>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <ShieldCheck className="size-3.5" />
                Secure Access
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your authorized admin credentials to access the management dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    disabled={loginMutation.isPending}
                    className="pl-9 text-sm"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    className="pl-9 pr-10 text-sm"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-medium transition-all duration-200"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials Quick Fill Helper */}
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <KeyRound className="size-3.5 text-primary" />
                  <span>Default Admin Account</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFillDemo}
                  className="h-6 px-2 text-[11px] font-medium text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Sparkles className="mr-1 size-3" />
                  Auto-fill
                </Button>
              </div>
              <div className="mt-1.5 space-y-0.5 text-muted-foreground font-mono text-[11px]">
                <div>Email: {defaultEmail}</div>
                <div>Password: {defaultPassword}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          CoreFit Health Platform &bull; Protected Admin Subsystem &bull; v1.0.0
        </p>
      </div>
    </div>
  );
}
