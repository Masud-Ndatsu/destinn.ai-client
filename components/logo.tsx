import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <h2 className="text-2xl md:text-3xl font-bold">
      <Link href={"/"}>DeStinn.AI</Link>
    </h2>
  );
};
export default Logo;
