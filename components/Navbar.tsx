"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X, User, LogOut, Settings } from "lucide-react";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ui/theme-toggle";
import useModalStore from "@/store/modal";
import { AuthModal } from "./AuthModal";
import { scrollToChat } from "@/lib/utils";
import {
  useCurrentUser,
  useAuthStore,
  useIsAuthenticated,
  useAuthLoading,
} from "@/store/auth";
import { UserRole } from "@/enum";
import { useChatbotStore } from "@/store/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoginModalOpen, setLoginModalOpen } = useModalStore();
  const { openChatbot } = useChatbotStore();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useAuthLoading();
  const { logout } = useAuthStore();

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
    openChatbot();
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
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

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Admin Dashboard Link */}
                  {user?.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* Career Advice Button */}
                  <Button
                    onClick={handleGetCareerAdvice}
                    size="sm"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Get Career Advice
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setLoginModalOpen(true)}
                    variant="outline"
                    size="sm"
                    disabled={isAuthLoading}
                  >
                    {isAuthLoading ? "Loading..." : "Sign In"}
                  </Button>
                  <Button
                    onClick={handleGetCareerAdvice}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700 text-white"
                    disabled={isAuthLoading}
                  >
                    Get Career Advice
                  </Button>
                </div>
              )}
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

                {/* Mobile Auth Section */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center px-3 py-2">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-base font-medium text-gray-800">
                            {getUserDisplayName()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </div>

                      {user?.role === UserRole.ADMIN && (
                        <Link
                          href="/admin"
                          onClick={handleMenuItemClick}
                          className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600"
                        >
                          <LayoutDashboard className="h-5 w-5 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Button
                        onClick={handleGetCareerAdvice}
                        className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 text-white"
                      >
                        Get Career Advice
                      </Button>

                      <div className="space-y-1">
                        <Button
                          onClick={() => router.push("/profile")}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          onClick={() => router.push("/settings")}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => setLoginModalOpen(true)}
                        variant="outline"
                        className="w-full"
                        disabled={isAuthLoading}
                      >
                        {isAuthLoading ? "Loading..." : "Sign In"}
                      </Button>
                      <Button
                        onClick={handleGetCareerAdvice}
                        className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 text-white"
                        disabled={isAuthLoading}
                      >
                        Get Career Advice
                      </Button>
                    </div>
                  )}
                </div>
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
