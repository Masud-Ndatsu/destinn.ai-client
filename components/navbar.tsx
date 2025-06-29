import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AiOutlineMenu } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="h-[70px] bg-gray-50 my-auto shadow-sm flex items-center justify-between px-4">
      <div className="flex gap-8 items-center">
        <div className="md:hidden text-xl">
          <AiOutlineMenu />
        </div>

        <Logo />

        <ul className="hidden md:flex gap-4 items-center">
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
        className="rounded-none shadow-none w-full hidden md:inline"
        placeholder="Search for career here..."
      />

      <IoSearch className="md:hidden text-2xl" />

      <div>
        <Button className="rounded-none font-semibold">Sign in</Button>
      </div>
    </nav>
  );
};

export default Navbar;
