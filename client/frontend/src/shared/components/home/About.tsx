import Image from "next/image";
import { useInView } from "../../../hooks/useInView";

const AboutSection = () => {
  const [ref, isInView] = useInView(0.1); // Trigger animations

  return (
    <div ref={ref} className="bg-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Image Section with Slide-in from Left */}
        <div
          className={`w-full md:w-1/2 transition-transform duration-2000 ease-in-out transform ${
            isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          }`}
        >
          <Image
            src="/img/about.jpg"
            alt="About us"
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        {/* Text Section with Slide-in from Bottom */}
        <div
          className={`w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 transition-transform duration-2000 ease-in-out transform ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">About Us</h2>
          <p className="text-lg text-gray-600 mb-6">
            CLVProject provides reliable transport and logistics solutions. We
            ensure fast, efficient, and global coverage.
          </p>

          {/* About Button */}
          <button >
            <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-900 transition duration-300 ease-in-out" href="/Page/About">
              Learn More About Us
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
