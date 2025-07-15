import { Navbar } from "@/components/Navbar";
import { ReactNode, Suspense } from "react";

export default function OpportunitiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="">
      <Suspense fallback={<div className="p-4 text-sm">Loading...</div>}>
        <Navbar />
        {children}
      </Suspense>
    </main>
  );
}
