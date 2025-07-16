"use client";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeaturedOpportunities } from "@/components/FeaturedOpportunities";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { isTokenExpired } from "@/lib/utils";

export default function Home() {
  const token = useAuthStore((s) => s.user?.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedOpportunities />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
