import { useInView } from "../../../hooks/useInView";

const AboutSection = () => {
  const [ref, isInView] = useInView(0); // Threshold set to 50% visibility

  return (
    <div ref={ref} className="bg-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Image Section with Slide-in from Left */}
        <div
          className={`w-full md:w-1/2 transition-transform delay-500 duration-2000 ease-in-out transform ${
            isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          }`}
        >
          <img
            src="/img/about.jpg"
            alt="About us"
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        {/* Text Section with Slide-in from Bottom */}
        <div
          className={`w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 transition-transform delay-500 duration-2000 ease-in-out transform ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">About Us</h2>
          <p className="text-lg text-gray-600">
            CLVProject provides reliable transport and logistics solutions. We
            ensure fast, efficient, and global coverage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
