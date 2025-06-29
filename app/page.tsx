import { MobileNavMenu, MobileNavSearch } from "@/components/mobile-nav";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
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
          className="rounded-none text-blue-950 border-white cursor-pointer hover:bg-white hover:text-blue-900 transition"
        >
          Receive Opportunities
        </Button>
      </section>
    </main>
  );
}
