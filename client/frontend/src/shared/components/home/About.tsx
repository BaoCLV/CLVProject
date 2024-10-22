import Image from "next/image"; 
import { useInView } from "../../../hooks/useInView";

const AboutSection = () => {
  const [ref, isInView] = useInView(0.1); // Trigger animations

  return (
    <div ref={ref} className="relative py-20 lg:py-32 ">
    {/* Transparent backdrop for blending with the background */}
    <div className="absolute inset-0  bg-white/10 backdrop-blur-md  transform"></div>
    
    {/* Main Content */}
    <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Image Section with Slide-in from Left */}
        <div
          className={`w-full md:w-1/2 transition-all duration-[1.5s] ease-in-out transform ${
            isInView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          <div className="rounded-lg shadow-lg overflow-hidden">
            <Image
              src="/img/about.jpg"
              alt="About us"
              className="rounded-lg w-full object-cover"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>

        {/* Text Section with Slide-in from Bottom */}
        <div
          className={`w-full md:w-1/2 mt-10 md:mt-0 md:ml-12 transition-all duration-[1.5s] delay-300 ease-in-out transform ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-5xl font-extrabold text-gray-800 mb-8">
            About Us
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            CLVProject provides reliable transport and logistics solutions, ensuring fast, efficient, and global coverage. Our mission is to simplify your logistics needs.
          </p>

          {/* About Button with 3D Effect */}
          <a href="/Page/About" className="inline-block">
            <button className="relative inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
              <span className="absolute inset-0 w-full h-full bg-blue-700 opacity-0 rounded-lg transition-opacity duration-300 ease-in-out hover:opacity-20"></span>
              Learn More About Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
