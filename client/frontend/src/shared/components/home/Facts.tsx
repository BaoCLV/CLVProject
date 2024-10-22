import { useState, useEffect } from "react";
import { useInView } from "../../../hooks/useInView";

// Counter with easing effect
const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // Total animation duration
    const increment = target / duration * 10; // Adjust speed

    const easeOutQuad = (t: number) => t; // Easing function

    const step = () => {
      start += increment;
      if (start < target) {
        setCount(Math.ceil(easeOutQuad(start)));
        requestAnimationFrame(step);
      } else {
        setCount(target); // Final target
      }
    };
    requestAnimationFrame(step);
  }, [target]);

  return <h2 className="text-5xl font-extrabold text-white">{count}</h2>;
};

const FactsSection = () => {
  const [ref, isInView] = useInView(0.1); // Hook to trigger visibility

  return (
    <div
      ref={ref}
      className={`transition-opacity  duration-1000 ease-in-out transform ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Layered Background with Parallax */}
      <div className="relative  overflow-hidden py-16">
        {/* Floating background elements */}
        <div
          className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ transform: isInView ? "translateY(0)" : "translateY(50px)" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-pulse"
          style={{ transform: isInView ? "translateY(0)" : "translateY(50px)" }}
        />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-wrap items-center">
            {/* Left Section - Text */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h6 className="text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-500 mb-6">
                Some Facts
              </h6>
              <h1 className="text-6xl font-extrabold mb-8 text-white leading-tight">
                #1 Place To Manage All Of Your Shipments
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum
                et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
              </p>
              <div className="flex items-center">
                <i className="fa fa-headphones text-white bg-gradient-to-r from-pink-400 to-yellow-500 p-5 rounded-full shadow-lg"></i>
                <div className="ml-4">
                  <h6 className="text-lg text-gray-300">Call for any query!</h6>
                  <h3 className="text-white text-3xl font-bold">+012 345 6789</h3>
                </div>
              </div>
            </div>

            {/* Right Section - Facts Cards */}
            <div className="w-full lg:w-1/2 flex flex-wrap -mx-4">
              {/* Card 1: Happy Clients */}
              <div className="w-full sm:w-1/2 px-4 mb-8 lg:mb-0">
                <div className="bg-white/10 backdrop-blur-lg p-8 text-center rounded-2xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:-rotate-1">
                  <i className="fa fa-users text-5xl mb-4 text-yellow-500"></i> {/* Unique Color */}
                  {isInView && <Counter target={1234} />}
                  <p className="text-gray-300 mt-4 text-lg">Happy Clients</p>
                </div>
              </div>

              {/* Card 2: Complete Shipments */}
              <div className="w-full sm:w-1/2 px-4 mb-8 lg:mb-0">
                <div className="bg-white/10 backdrop-blur-lg p-8 text-center rounded-2xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:rotate-1">
                  <i className="fa fa-ship text-5xl mb-4 text-pink-500"></i> {/* Unique Color */}
                  {isInView && <Counter target={5678} />}
                  <p className="text-gray-300 mt-4 text-lg">Complete Shipments</p>
                </div>
              </div>

              {/* Card 3: Customer Reviews */}
              <div className="w-full sm:w px-4 py-4">
                <div className="bg-white/10 backdrop-blur-lg p-8 text-center rounded-2xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:-rotate-1">
                  <i className="fa fa-star text-5xl mb-4 text-green-500"></i> {/* Unique Color */}
                  {isInView && <Counter target={91011} />}
                  <p className="text-gray-300 mt-4 text-lg">Customer Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactsSection;
