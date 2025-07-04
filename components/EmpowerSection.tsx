import Image from "next/image";

const EmpowerSection = () => {
  return (
    <section className="bg-white py-26 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-indigo-800">
              EMPOWER YOUR FUTURE
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wider">
              Explore transformative
              <br />
              opportunities
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Aimhigher connects you with life-changing opportunities that can
              shape your future. With a diverse range of scholarships,
              universities, leadership programs, jobs, and internships, you'll
              find the perfect fit for your aspirations. Our user-friendly
              platform, located in Weesp, NL helps you navigate through
              countless options effortlessly, ensuring you can seize the right
              opportunity at the right time. Start your journey today and unlock
              your full potential with Aimhigher.
            </p>
          </div>

          <div className="">
            <Image src={""} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpowerSection;
