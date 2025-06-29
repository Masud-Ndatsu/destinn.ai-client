"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "../logo";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/opportunities", label: "Opportunities" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-full border-r p-4 bg-muted/30">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-3 py-2 hover:bg-blue-950 hover:text-gray-50",
              pathname === link.href && "bg-muted font-medium"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
