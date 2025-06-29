import Link from "next/link";
import React from "react";
import { Input } from "./ui/input";
import { IoClose } from "react-icons/io5";

export const MobileNavMenu = () => {
  return (
    <article className="bg-gray-50 absolute top-[70px] left-0 h-screen w-full p-8">
      <ul className="flex flex-col gap-4">
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
  return (
    <article className="bg-gray-50 absolute top-0 left-0 h-screen w-full p-8">
      <IoClose className="absolute right-[8px] top-[16px] text-xl" />
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
