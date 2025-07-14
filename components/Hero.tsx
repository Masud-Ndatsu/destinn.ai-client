"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  const scrollToOpportunities = () => {
    const opportunities = document.getElementById("opportunities");
    if (opportunities) {
      opportunities.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToChat = () => {
    const chatWidget = document.querySelector("[data-chat-widget]");
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 pt-20">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Career Discovery
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground animate-fade-in delay-200">
            Discover Opportunities.
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Empower Your Future.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in delay-300">
            Unlock your potential with AI-powered career guidance. Find
            scholarships, internships, jobs, and learning opportunities tailored
            specifically for ambitious young minds like yours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-500">
            <Button
              size="lg"
              onClick={scrollToOpportunities}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Browse Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToChat}
              className="border-2 border-primary/50 hover:border-primary text-foreground hover:text-primary px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Talk to AI Agent
            </Button>
          </div>

          {/* Stats */}
          <div className="sm:pt-16 grid grid-cols-3 gap-8 animate-fade-in delay-700">
            <div className="text-center">
              <div className="sm:text-3xl md:text-4xl font-bold text-primary">
                10K+
              </div>
              <div className="text-muted-foreground mt-2">
                Opportunities Available
              </div>
            </div>
            <div className="text-center">
              <div className="sm:text-3xl md:text-4xl font-bold text-accent">
                5K+
              </div>
              <div className="text-muted-foreground mt-2">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="sm:text-3xl md:text-4xl font-bold text-primary">
                95%
              </div>
              <div className="text-muted-foreground mt-2">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
