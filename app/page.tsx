"use client";
import { MobileNavMenu, MobileNavSearch } from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  const mockOpportunities = [
    {
      id: "1",
      title: "Frontend Developer Internship",
      company: "Andela",
      location: "Remote",
      deadline: "July 10, 2025",
      image: "https://source.unsplash.com/featured/?technology",
    },
    {
      id: "2",
      title: "AI Research Fellowship",
      company: "Google Research",
      location: "Kenya",
      deadline: "July 30, 2025",
      image: "https://source.unsplash.com/featured/?ai,africa",
    },
    {
      id: "3",
      title: "Youth Leadership Bootcamp",
      company: "UNDP",
      location: "Nigeria",
      deadline: "August 1, 2025",
      image: "https://source.unsplash.com/featured/?leadership,young",
    },
  ];

  return (
    <main className="relative">
      <Navbar />
      <MobileNavMenu />
      <MobileNavSearch />

      <section className="bg-blue-900 text-white py-2 text-center min-h-[500px] px-4">
        <h2 className="text-3xl mt-8 md:text-4xl xl:text-6xl md:mt-[100px] font-bold uppercase text-gray-50">
          This Career is Yours
        </h2>
        <p className="md:text-xl mx-auto mb-8 tracking-widest max-w-2xl text-gray-50 my-4">
          100,360 opportunities to find the job that’s made for you.
        </p>

        <div className="w-full max-w-xl mx-auto my-3 flex flex-col gap-4 md:gap-0 md:flex-row">
          <Input
            type="text"
            placeholder="Search job by title, keyword or company"
            className="block rounded-none p-6 text-base text-black bg-white flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button className="rounded-none text-base p-6 cursor-pointer">
            Search
          </Button>
        </div>

        <p className="md:text-lg mt-12 mb-6 max-w-2xl mx-auto text-gray-50">
          Companies are interested in your profile. Let them see you’re
          available.
        </p>

        <Button
          variant="outline"
          className="rounded-none text-blue-950 border-white cursor-pointer hover:bg-white hover:text-blue-950 transition"
        >
          Receive Opportunities
        </Button>
      </section>
      <section className="bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-bold uppercase mb-4">
            Latest Opportunities
          </h3>
          <p className="text-gray-600 mb-10">
            Explore curated opportunities from trusted platforms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white p-0 text-left shadow-sm hover:shadow-md transition border"
              >
                <div className="w-full h-[160px] relative">
                  <Image
                    src={opportunity.image}
                    alt={opportunity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-1">
                    {opportunity.title}
                  </h4>
                  <p className="text-sm text-gray-700">{opportunity.company}</p>
                  <p className="text-sm text-gray-500">
                    {opportunity.location}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Deadline: <strong>{opportunity.deadline}</strong>
                  </p>
                  <Button className="mt-4 rounded-none w-full text-sm">
                    View Opportunity
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button className="rounded-none px-8 text-sm">Load More</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
