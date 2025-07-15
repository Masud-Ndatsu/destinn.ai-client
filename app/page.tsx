"use client";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeaturedOpportunities } from "@/components/FeaturedOpportunities";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { AuthModal } from "@/components/AuthModal";
import useModalStore from "@/stores/modal";
import { scrollToChat } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const { isLoginModalOpen, setLoginModalOpen } = useModalStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleContinueAsGuest = () => {
    setLoginModalOpen(false);
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToChat(), 100);
    } else {
      scrollToChat();
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedOpportunities />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <ChatbotWidget />
      {/* Auth Modal */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </div>
  );
}
