import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="bg-blue-900 text-white py-16 text-center min-h-[500px] flex flex-col justify-center items-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase text-gray-50">
          This Career is Yours
        </h2>
        <p className="text-lg md:text-xl mb-8 tracking-wide max-w-2xl text-gray-50">
          100,360 opportunities to find the job that’s made for you.
        </p>

        <div className="w-full max-w-xl flex mb-8 h-12">
          <Input
            type="text"
            placeholder="Search job by title, keyword or company"
            className="rounded-none px-4 py-2 text-black bg-white h-full flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button className="h-full rounded-none text-base px-6">Search</Button>
        </div>

        <p className="text-lg md:text-xl mb-6 max-w-2xl text-gray-50">
          Companies are interested in your profile. Let them see you’re
          available.
        </p>

        <Button
          variant="outline"
          className="rounded-none text-blue-950 border-white hover:bg-white hover:text-blue-900 transition"
        >
          Receive Opportunities
        </Button>
      </section>
    </>
  );
}
