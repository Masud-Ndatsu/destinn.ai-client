"use client";
import { LoginForm } from "@/components/auth/login";
import { MobileNavMenu, MobileNavSearch } from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/lib/queries/useCategories";
import { useOpportunities } from "@/lib/queries/useOpportunities";
import useModalStore from "@/stores/modal";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const isOpen = useModalStore((state) => state.isLoginModalOpen);
  const setOpen = useModalStore((state) => state.setLoginModalOpen);
  const { data: categories, isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: opportunities, isLoading: loadingOpps } = useOpportunities();

  console.log({ categories, opportunities });

  const mockOpportunities =
    opportunities?.data?.length > 0
      ? opportunities?.data
      : [
          {
            id: "1",
            title: "Frontend Developer Internship",
            company: "Andela",
            location: "Remote",
            deadline: "July 10, 2025",
            source_url:
              "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
          },
          {
            id: "2",
            title: "AI Research Fellowship",
            company: "Google Research",
            location: "Kenya",
            deadline: "July 30, 2025",
            source_url:
              "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
          },
          {
            id: "3",
            title: "Youth Leadership Bootcamp",
            company: "UNDP",
            location: "Nigeria",
            deadline: "August 1, 2025",
            source_url:
              "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
          },
        ];

  const mockCategories =
    categories?.data?.length > 0
      ? categories?.data
      : [
          { id: "1", name: "Technology" },
          { id: "2", name: "Leadership" },
          { id: "3", name: "Fellowship" },
          { id: "4", name: "Internship" },
        ];

  return (
    <main className="relative">
      <Navbar />
      <MobileNavMenu />
      <MobileNavSearch />

      <section className="bg-blue-900 text-white py-10 md:py-6 text-center min-h-[500px] px-4">
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

      <section className="bg-white py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4">
            Browse by Category
          </h3>
          <p className="text-gray-600 mb-8">
            Find opportunities tailored to your interests.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {isLoading && (
              <>
                <p>Loading categories...</p>
              </>
            )}
            {mockCategories?.map((category: any) => (
              <Button
                key={category.id}
                variant={"outline"}
                className={`rounded-none px-6 py-3 text-sm text-blue-950 border-blue-900 hover:bg-blue-900 hover:text-white transition`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-bold uppercase mb-4">
            Latest Opportunities
          </h3>
          <p className="text-gray-600 mb-10">
            Explore curated opportunities from trusted platforms.
          </p>

          {loadingOpps ? (
            <p>Loading opportunities...</p>
          ) : mockOpportunities?.length === 0 ? (
            <p className="text-gray-400">No opportunities found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOpportunities?.map((opportunity: any) => (
                <div
                  key={opportunity?.id}
                  className="bg-white p-0 text-left shadow-sm hover:shadow-md transition border"
                >
                  <div className="w-full h-[160px] relative">
                    <Image
                      src={opportunity?.source_url}
                      alt={opportunity?.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-1">
                      {opportunity?.title}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {opportunity?.company}
                    </p>
                    <p className="text-sm text-gray-500">
                      {opportunity?.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Deadline: <strong>{opportunity?.deadline}</strong>
                    </p>
                    <Button className="mt-4 rounded-none w-full text-sm">
                      View Opportunity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Button className="rounded-none px-8 text-sm">Load More</Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-bold uppercase mb-4">
            Rethink work with our expertise
          </h3>
          <p className="text-gray-600 mb-10">
            Articles, advice, videos, testimonials: Discover practical content
            to thrive at work.
          </p>

          <h4 className="text-2xl md:text-4xl font-bold text-left mb-6">
            Insights
          </h4>
          <Separator className="mb-6" />

          <div className="flex flex-wrap justify-start gap-6 mb-10 text-sm font-medium">
            {["Job hunters", "Students", "Workers", "Decision-makers"].map(
              (tab) => (
                <Button
                  key={tab}
                  variant="outline"
                  className="rounded-none border-black text-black hover:bg-blue-900 hover:text-white transition"
                >
                  {tab}
                </Button>
              )
            )}
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Follow hiring trends",
                image:
                  "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                bg: "bg-blue-100",
              },
              {
                title: "Apply effectively",
                image:
                  "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                bg: "bg-pink-100",
              },
              {
                title: "Ace your interview",
                image:
                  "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                bg: "bg-orange-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`text-left border rounded-none overflow-hidden shadow-sm hover:shadow-md transition`}
              >
                <h5 className="text-lg font-semibold p-4">{item.title}</h5>
                <div className={`${item.bg} p-4`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Latest Article Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-6 border-b border-gray-300 pb-2">
              Latest Article
            </h3>

            <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden shadow-sm border">
              <Image
                src="https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg"
                alt="The Bear: When professional passion turns toxic"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white">
                <h4 className="text-xl font-semibold mb-1">
                  The Bear: When professional passion turns toxic
                </h4>
                <p className="text-sm">December 31, 2024</p>
              </div>
            </div>

            <Button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black w-full rounded-none text-sm font-semibold">
              Keep reading
            </Button>
          </div>

          {/* Trending Section */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-6 border-b border-gray-300 pb-2">
              Trending
            </h3>

            <ol className="space-y-5 text-left">
              {[
                {
                  title:
                    "What Kamala Harris’s legacy means for the future of female leadership",
                  date: "November 6, 2024",
                },
                {
                  title:
                    "Resume hacks: 10 tips for cherry-picking skills to land the job",
                  date: "November 25, 2024",
                },
                {
                  title: "Reclaiming power: remember your manager needs you!",
                  date: "June 28, 2023",
                },
                {
                  title: "9 signs your office could be a sitcom",
                  date: "November 7, 2024",
                },
                {
                  title: "Just how big is the LGBTQ+ wage gap?",
                  date: "September 18, 2023",
                },
              ].map((item, idx) => (
                <li key={idx}>
                  <div className="flex items-start gap-3">
                    <span className="text-base font-bold text-yellow-500">
                      {idx + 1}
                    </span>
                    <div>
                      <a
                        href="#"
                        className="text-sm font-medium text-blue-900 underline hover:no-underline"
                      >
                        {item.title}
                      </a>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  {idx < 4 && <hr className="my-4 border-gray-200" />}
                </li>
              ))}
            </ol>

            <Button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black w-full rounded-none text-sm font-semibold">
              Keep reading
            </Button>
          </div>
        </div>
      </section>

      <Modal
        trigger={null}
        openModal={isOpen}
        closeModal={() => setOpen(!isOpen)}
      >
        <LoginForm />
      </Modal>
    </main>
  );
}
