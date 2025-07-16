"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserPlus, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { create } from "zustand";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { signInUser, signUpUser } from "@/lib/actions/auth";
import { UserRole } from "@/enum";
import { toast } from "sonner";
import { useAuthStore, useCurrentUser } from "@/store/auth";
import { AuthFormData, authSchema } from "@/types/user";

// Zustand store for auth state

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  onContinueAsGuest,
}: AuthModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";
  const { login } = useAuthStore();
  const user = useCurrentUser();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      educationLevel: "",
      experienceYears: "",
      interests: "",
    },
  });

  const updateModeParam = (newMode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onSubmit = async (data: AuthFormData) => {
    const {
      email,
      password,
      educationLevel,
      experienceYears,
      firstName,
      lastName,
    } = data;

    if (isSignUp) {
      const response = await signUpUser({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        education_level: educationLevel,
        experience_years: experienceYears || 0,
        interests: data.interests?.split(",").map((i) => i.trim()) || [],
      });
      console.log({ response });

      if (response.success) {
        updateModeParam("signin");
      }
    } else {
      const response = await signInUser({
        email,
        password,
      });

      console.log({ response });

      if (response.success) {
        // Set user data in Zustand store
        login({
          email: response.data.user.email,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          educationLevel: response.data.user.education_level,
          experienceYears: response.data.user.experience_years,
          interests: response.data.user.interests,
          isGuest: false,
          role: response!.data.user.role, // Add role from response
        });
        toast.success("Logged in successfully!");
        onClose();
        // Redirect based on user role
        if (user?.role === UserRole.ADMIN) {
          router.push("/admin");
          console.log("Pushed to admin");
        } else {
          router.push("/");
        }
      }
    }
  };

  const handleGuestContinue = () => {
    // Set guest user data

    form.reset();
    onContinueAsGuest();
  };

  const handleToggleMode = () => {
    const newMode = isSignUp ? "signin" : "signup";
    updateModeParam(newMode);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[900]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignUp
              ? "Join FuturePathFinder to get personalized career advice"
              : "Sign in to access your personalized career dashboard"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {isSignUp && (
              <>
                <div>
                  <Input
                    placeholder="First Name"
                    {...form.register("firstName", { required: isSignUp })}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.firstName.message ||
                        "First name is required"}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Last Name"
                    {...form.register("lastName", { required: isSignUp })}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.lastName.message ||
                        "Last name is required"}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Education Level"
                    {...form.register("educationLevel", { required: isSignUp })}
                  />
                  {form.formState.errors.educationLevel && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.educationLevel.message ||
                        "Education level is required"}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    placeholder="Years of Experience"
                    min="0"
                    {...form.register("experienceYears", {
                      required: isSignUp,
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.experienceYears && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.experienceYears.message ||
                        "Experience is required"}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Interests (comma separated)"
                    {...form.register("interests", { required: isSignUp })}
                  />
                  {form.formState.errors.interests && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.interests.message ||
                        "Interests are required"}
                    </p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700"
              disabled={form.formState.isSubmitting}
            >
              {isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Account"}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestContinue}
            disabled={form.formState.isSubmitting}
          >
            <Users className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleToggleMode}
              className="text-sm"
              disabled={form.formState.isSubmitting}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
