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
import { User, UserPlus, Users, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, memo } from "react";
import { signInUser, signUpUser } from "@/lib/actions/auth";
import { UserRole } from "@/enum";
import { useAuthStore, useAuthLoading } from "@/store/auth";
import { AuthFormData, signInSchema, signUpSchema } from "@/types/user";
import { toast } from "react-toastify";
import { scheduleAutoLogout } from "@/lib/utils";

// SignIn Form Component
const SignInForm = memo(
  ({
    form,
    onSubmit,
    isLoading,
  }: {
    form: any;
    onSubmit: (data: AuthFormData) => void;
    isLoading: boolean;
  }) => {
    return (
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

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <User className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    );
  }
);

SignInForm.displayName = "SignInForm";

// SignUp Form Component
const SignUpForm = memo(
  ({
    form,
    onSubmit,
    isLoading,
  }: {
    form: any;
    onSubmit: (data: AuthFormData) => void;
    isLoading: boolean;
  }) => {
    return (
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

        <div>
          <Input
            placeholder="First Name"
            {...form.register("firstName", { required: true })}
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
            {...form.register("lastName", { required: true })}
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
            {...form.register("educationLevel", { required: true })}
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
              required: true,
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
            {...form.register("interests", { required: true })}
          />
          {form.formState.errors.interests && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.interests.message ||
                "Interests are required"}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    );
  }
);

SignUpForm.displayName = "SignUpForm";

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
  const { login, setLoading } = useAuthStore();
  const isLoading = useAuthLoading();

  // Create form with dynamic resolver based on mode
  const currentSchema = isSignUp ? signUpSchema : signInSchema;
  const form = useForm<AuthFormData>({
    resolver: zodResolver(currentSchema),
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

  console.log("🔘 Button state debug:", {
    isLoading,
    formIsSubmitting: form.formState.isSubmitting,
    formErrors: form.formState.errors,
    isSignUp,
    modalOpen: isOpen,
  });

  const updateModeParam = useCallback(
    (newMode: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", newMode);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSignIn = useCallback(
    async (data: AuthFormData) => {
      const { email, password } = data;

      setLoading(true);
      console.log("🔐 Starting signin process from AuthModal...");
      console.log("📧 Email:", email);
      console.log("🔑 Password length:", password.length);

      try {
        const response = await signInUser({
          email,
          password,
        });

        console.log("✅ Signin response in AuthModal:", {
          success: response.success,
          message: response.message,
          hasData: !!response.data,
          hasUser: !!response.data?.user,
          hasToken: !!response.data?.access_token,
        });

        if (response.success) {
          const userData = {
            email: response.data.user.email,
            firstName: response.data.user.first_name,
            lastName: response.data.user.last_name,
            educationLevel: response.data.user.education_level,
            experienceYears: response.data.user.experience_years,
            interests: response.data.user.interests,
            isGuest: false,
            role: response.data.user.role,
            accessToken: response.data.access_token,
          };

          // Set user data in Zustand store
          login(userData);

          // Schedule auto-logout
          if (response.data.access_token) {
            scheduleAutoLogout(response.data.access_token, () => {
              toast.info("Session expired. Please sign in again.");
              useAuthStore.getState().logout();
            });
          }

          toast.success("Logged in successfully!");
          console.log(
            "✅ Signin successful - will reset loading in finally block"
          );
          onClose();

          // Redirect based on user role
          if (response.data.user.role === UserRole.ADMIN) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
      } catch (error: any) {
        console.error("❌ Error in handleSignIn:", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
        toast.error(error?.message);
      } finally {
        console.log("🔄 Resetting signin loading state to false");
        setLoading(false);
      }
    },
    [setLoading, login, onClose, router]
  );

  const handleSignUp = useCallback(
    async (data: AuthFormData) => {
      const {
        email,
        password,
        firstName,
        lastName,
        educationLevel,
        experienceYears,
      } = data;

      setLoading(true);
      console.log("📝 Starting signup process from AuthModal...");
      console.log("📧 Email:", email);
      console.log("👤 Name:", firstName, lastName);

      try {
        const response = await signUpUser({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          education_level: educationLevel,
          experience_years: experienceYears || 0,
          interests: data.interests?.split(",").map((i) => i.trim()) || [],
        });

        console.log("✅ Signup response in AuthModal:", {
          success: response.success,
          message: response.message,
          hasData: !!response.data,
        });

        if (response.success) {
          toast.success("Account created successfully! Please sign in.");
          updateModeParam("signin");
          form.reset();
          console.log(
            "✅ Signup successful - will reset loading in finally block"
          );
        }
      } catch (error: any) {
        console.error("❌ Error in handleSignUp:", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
        toast.error(error?.message);
      } finally {
        console.log("🔄 Resetting signup loading state to false");
        setLoading(false);
      }
    },
    [setLoading, updateModeParam, form]
  );

  const onSubmit = useCallback(
    async (data: AuthFormData) => {
      console.log("⏳ Form submitted - routing to appropriate handler");

      if (isSignUp) {
        await handleSignUp(data);
      } else {
        await handleSignIn(data);
      }
    },
    [isSignUp, handleSignIn, handleSignUp]
  );

  const handleGuestContinue = useCallback(() => {
    // Set guest user data

    form.reset();
    onContinueAsGuest();
  }, [form, onContinueAsGuest]);

  const handleToggleMode = useCallback(() => {
    const newMode = isSignUp ? "signin" : "signup";
    updateModeParam(newMode);
  }, [isSignUp, updateModeParam]);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setLoading(false);
      console.log("🔄 Modal closed - All loading states reset");
    } else {
      // Reset loading state when modal opens
      setLoading(false);
      console.log("🔄 Modal opened - All loading states reset");
    }
  }, [isOpen, form, setLoading]);

  // Handle form state when mode changes
  useEffect(() => {
    // Reset form and clear all errors when switching modes
    form.reset({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      educationLevel: "",
      experienceYears: "",
      interests: "",
    });
    form.clearErrors();
    console.log(
      "🔄 Mode changed - Reset form and cleared errors for:",
      isSignUp ? "signup" : "signin"
    );
  }, [isSignUp, form]);

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
          {isSignUp ? (
            <SignUpForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
          ) : (
            <SignInForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
          )}

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
            disabled={isLoading}
          >
            <Users className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleToggleMode}
              className="text-sm"
              disabled={isLoading}
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
