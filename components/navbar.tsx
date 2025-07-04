"use client";

import React, { useCallback } from "react";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { AiOutlineMenu } from "react-icons/ai";
import { IoClose, IoSearch } from "react-icons/io5";
import useNavbarStore from "@/stores/navbar";
import useModalStore from "@/stores/modal";
import { useAuthStatus } from "@/hooks/use-auth-status";

const Navbar = () => {
  const setMenuView = useNavbarStore((state) => state.setMenuView);
  const isMenuView = useNavbarStore((state) => state.isMenuView);
  const setSearchView = useNavbarStore((state) => state.setSearchView);
  const open = useModalStore((state) => state.setLoginModalOpen);
  const { isAuthenticated } = useAuthStatus();

  const handleSignInClick = useCallback(() => {
    open(true);
  }, [open]);
  return (
    <nav className="h-[70px] bg-gray-50 my-auto shadow-sm flex items-center gap-6 justify-between px-4">
      <div className="flex gap-8 items-center">
        <div className="md:hidden text-xl">
          {!isMenuView && (
            <AiOutlineMenu onClick={() => setMenuView(!isMenuView)} />
          )}
          {isMenuView && (
            <IoClose
              className="text-2xl cursor-pointer"
              onClick={() => setMenuView(false)}
              aria-label="Close menu"
            />
          )}
        </div>

        <Logo />
      </div>

      <ul className="hidden lg:flex gap-8 items-center">
        <li className="tracking-wider">
          <Link href={"/explore"}>Explore</Link>
        </li>
        <li className="tracking-wider">
          <Link href={"/opportunities"}>Opportunities</Link>
        </li>
        <li className="tracking-wider">
          <Link href={"/blogs"}>Blogs</Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <div className="pl-6">
          <IoSearch
            className="md:hidden text-2xl"
            onClick={() => setSearchView(true)}
          />
        </div>

        {isAuthenticated ? (
          <Link href="/dashboard">
            <Button variant="default" className="rounded-none">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Button
            variant="default"
            className="rounded-none"
            onClick={handleSignInClick}
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
