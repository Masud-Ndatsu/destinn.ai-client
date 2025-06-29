"use client";

import React, { useCallback } from "react";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

        <ul className="hidden lg:flex gap-4 items-center">
          <li className="tracking-wider">
            <Link href={"/explore"}>Find a job</Link>
          </li>
          <li className="tracking-wider">
            <Link href={"/opportunities"}>Find a company</Link>
          </li>
          <li className="tracking-wider">
            <Link href={"/blogs"}>Media</Link>
          </li>
        </ul>
      </div>

      <Input
        type="text"
        className="rounded-none shadow-none w-full hidden md:inline max-w-[450px]"
        placeholder="Search for career here..."
      />

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
            variant="outline"
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
