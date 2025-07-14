import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { FeaturedOpportunities } from "@/components/FeaturedOpportunities";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export default function Home() {
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
