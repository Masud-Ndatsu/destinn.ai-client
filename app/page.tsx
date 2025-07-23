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
import { useFeaturedOpportunities } from "@/lib/queries/useOpportunities";
import { Loader2, Sparkles, Target, TrendingUp } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Home() {
  const token = useAuthStore((s) => s.user?.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const { isLoading: isLoadingOpportunities } = useFeaturedOpportunities();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token, logout]);

  console.log("🏠 Home page loading state:", { isLoadingOpportunities });

  // Show responsive loading state
  if (isLoadingOpportunities) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AiOutlineLoading3Quarters className="h-8 w-8 sm:h-10 sm:w-10 md:h-28 md:w-28 animate-spin text-blue-600" />
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
