"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ui/theme-toggle";
import useModalStore from "@/store/modal";
import { AuthModal } from "./AuthModal";
import { scrollToChat } from "@/lib/utils";
import { useCurrentUser } from "@/store/auth";
import { UserRole } from "@/enum";
import { useChatbotStore } from "@/store/chat";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoginModalOpen, setLoginModalOpen } = useModalStore();
  const { openChatbot } = useChatbotStore();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  const handleContinueAsGuest = () => {
    setLoginModalOpen(false);
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToChat(), 100);
    } else {
      scrollToChat();
    }
  };

  const handleGetCareerAdvice = () => {
    if (user) {
      openChatbot();
    } else setLoginModalOpen(true);
  };

  const handleMenuItemClick = () => {
    // setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-accent backdrop-blur-sm z-[500] border-b">
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
              <div className="ml-10 flex items-center space-x-8">
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
                <Link
                  href="/#about"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/#contact"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              {user?.role === UserRole.ADMIN && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LayoutDashboard />
                </Link>
              )}
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

                <Link
                  href="/#about"
                  onClick={handleMenuItemClick}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                >
                  About
                </Link>
                <Link
                  href="/#contact"
                  onClick={handleMenuItemClick}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                >
                  Contact
                </Link>
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
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </>
  );
};
