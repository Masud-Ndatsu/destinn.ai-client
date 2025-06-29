"use client";
import Link from "next/link";
import React from "react";
import { Input } from "./ui/input";
import { IoClose } from "react-icons/io5";
import useNavbarStore from "@/stores/navbar";

export const MobileNavMenu = () => {
  const isMenuView = useNavbarStore((state) => state.isMenuView);
  const setMenuView = useNavbarStore((state) => state.setMenuView);

  return (
    <article
      className={`bg-gray-50 fixed top-[70px] left-0 h-screen w-full p-12 z-50 transition-transform duration-300 ${
        isMenuView ? "translate-x-0" : "-translate-x-full pointer-events-none"
      }`}
      aria-hidden={!isMenuView}
    >
      <ul className="flex flex-col gap-4 mt-8">
        <li>
          <Link className="font-semibold" href={"/"}>
            Home
          </Link>
        </li>
        <li>
          <Link className="font-semibold" href={"/"}>
            Find a job
          </Link>
        </li>
        <li>
          <Link className="font-semibold" href={"/"}>
            Find a company
          </Link>
        </li>
        <li>
          <Link className="font-semibold" href={"/media"}>
            Media
          </Link>
        </li>
      </ul>
    </article>
  );
};

export const MobileNavSearch = () => {
  const isSearchView = useNavbarStore((state) => state.isSearchView);
  const setSearchView = useNavbarStore((state) => state.setSearchView);

  return (
    <article
      className={`bg-gray-50 fixed top-0 left-0 h-screen w-full p-12 z-50 transition-transform duration-300 ${
        isSearchView ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
      aria-hidden={!isSearchView}
    >
      <IoClose
        className="absolute right-[16px] top-[16px] text-2xl cursor-pointer"
        onClick={() => setSearchView(false)}
        aria-label="Close search"
      />
      <Input
        type="text"
        className="rounded-none p-6 shadow-none border border-blue-950 text-gray-600 tracking-wider"
        placeholder="Search a job, company or article"
      />

      <div className="pt-24 text-center max-w-[300px] mx-auto tracking-wider">
        <h2 className="text-2xl font-bold my-6">
          What can we help you with today?
        </h2>
        <p className="">Search among jobs, companies, articles and more</p>
      </div>
    </article>
  );
};
