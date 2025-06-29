import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
const Navbar = () => {
  return (
    <nav className="h-[70px] my-auto shadow-sm flex items-center justify-evenly">
      <div className="flex gap-8">
        <Logo />

        <ul className="flex gap-4 items-center">
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

      <div className="flex gap-4 items-center">
        <Input
          type="text"
          className="rounded-none outline-none shadow-none w-full"
          placeholder="Search for career here..."
        />
        <Link className="tracking-wider" href={"/opportunities"}>
          Opportunities
        </Link>
      </div>

      <div>
        <Button className="rounded-none font-semibold">Sign in</Button>
      </div>
    </nav>
  );
};

export default Navbar;
