"use client";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeaturedOpportunities } from "@/components/FeaturedOpportunities";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { isTokenExpired } from "@/lib/utils";
import { useOpportunities } from "@/lib/queries/useOpportunities";
import { Loader2 } from "lucide-react";

export default function Home() {
  const token = useAuthStore((s) => s.user?.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const { isLoading: isLoadingOpportunities } = useOpportunities();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token, logout]);

  console.log("🏠 Home page loading state:", { isLoadingOpportunities });

  // Show full page loading state
  if (isLoadingOpportunities) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Loading AmbitfulAI</h2>
            <p className="text-muted-foreground">Please wait while we prepare your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedOpportunities />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
