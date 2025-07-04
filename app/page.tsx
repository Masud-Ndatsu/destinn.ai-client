"use client";
import { LoginForm } from "@/components/auth/login";
import EmpowerSection from "@/components/EmpowerSection";
import { MobileNavMenu, MobileNavSearch } from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategories } from "@/lib/queries/useCategories";
import { useOpportunities } from "@/lib/queries/useOpportunities";
import useModalStore from "@/stores/modal";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const isOpen = useModalStore((state) => state.isLoginModalOpen);
  const setOpen = useModalStore((state) => state.setLoginModalOpen);
  const isMobile = useIsMobile(640);
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

  // Slider state
  const sliderRef = useRef<HTMLDivElement>(null);

  // Slider navigation handlers
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <main className="relative">
      <Navbar />
      <MobileNavMenu />
      <MobileNavSearch />

      <section className="relative min-h-[80vh] flex items-center justify-center text-white px-4">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg" // replace with your actual image URL
            alt="Unlock your potential"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl w-full">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Unlock your potential
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Discover opportunities that change lives
          </p>

          {/* Search Bar */}
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

          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 font-medium text-sm md:text-base rounded-none">
            View Opportunities
          </Button>
        </div>
      </section>

      <section className="bg-[#F3F6F5] py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-600 font-semibold mb-2 uppercase">
            Unlock your potential
          </p>

          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            Discover life-changing opportunities today!
          </h3>

          {isLoading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="relative">
              {/* Slider Navigation */}
              <button
                aria-label="Scroll left"
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                style={{
                  display: mockCategories.length <= 1 ? "none" : undefined,
                }}
              >
                &#8592;
              </button>
              <button
                aria-label="Scroll right"
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                style={{
                  display: mockCategories.length <= 1 ? "none" : undefined,
                }}
              >
                &#8594;
              </button>
              {/* Slider */}
              <div
                ref={sliderRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {mockCategories?.map((category: any, index: number) => {
                  const images = [
                    "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                    "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                    "https://res.cloudinary.com/masudnda/image/upload/v1751274682/banners/u8i1ufawuxkim5kjg0oy.jpg",
                  ];

                  const descriptions = [
                    "Unlock your potential with financial support for your education.",
                    "Gain valuable experience and mentorship through fellowship programs.",
                    "Kickstart your career with dynamic internship opportunities.",
                  ];

                  return (
                    <Card
                      className="rounded-none bg-white shadow-sm transition hover:shadow-lg overflow-hidden p-0 min-w-[260px] max-w-[320px] flex-shrink-0"
                      key={category.id}
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="relative w-full h-[150px] sm:h-[200px]">
                        <Image
                          src={images[index % images.length]}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-3 sm:p-6">
                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                          {category.name}
                          <span className="text-xl font-normal ml-1">›</span>
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                          {isMobile ? (
                            <>
                              {descriptions[index % descriptions.length].slice(
                                0,
                                25
                              )}
                              {descriptions[index % descriptions.length]
                                .length > 25 && "..."}
                            </>
                          ) : (
                            <>{descriptions[index % descriptions.length]}</>
                          )}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <EmpowerSection />

      {/* <section className="bg-gray-50 py-16 px-6 md:px-12">
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
      </section> */}

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
