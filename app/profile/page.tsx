"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfilePage } from "@/components/ProfilePage";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProfilePage />
      <Footer />
    </div>
  );
}