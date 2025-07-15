"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { AuthModal } from "@/components/AuthModal";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./ui/theme-toggle";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const scrollToChat = () => {
    const chatWidget = document.querySelector("[data-chat-widget]");
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetCareerAdvice = () => {
    setIsAuthModalOpen(true);
  };

  const handleContinueAsGuest = () => {
    setIsAuthModalOpen(false);
    // Navigate to home page first if not already there, then scroll to chat
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToChat(), 100);
    } else {
      scrollToChat();
    }
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-accent backdrop-blur-sm z-5000 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-[#3498db]/100 bg-clip-text text-transparent"
              >
                AmbitfulAI
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/#opportunities"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive("/opportunities")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Opportunities
                </Link>
                <CategoryDropdown />
                <a
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            <ThemeToggle />

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={handleGetCareerAdvice}
                className="bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700 text-white"
              >
                Get Career Advice
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <Link
                  href="/"
                  onClick={handleMenuItemClick}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/#opportunities"
                  onClick={handleMenuItemClick}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/opportunities")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Opportunities
                </Link>
                <CategoryDropdown />

                <a
                  href="/#about"
                  onClick={handleMenuItemClick}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                >
                  About
                </a>
                <a
                  href="/#contact"
                  onClick={handleMenuItemClick}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                >
                  Contact
                </a>
                <Button
                  onClick={handleGetCareerAdvice}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-[#3498db]/100 text-white"
                >
                  Get Career Advice
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </>
  );
};
