import { useState, useEffect } from "react";
import { useInView } from "../../../hooks/useInView";

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500; 
    const increment = target / duration; 
    const step = () => {
      start += increment;
      if (start < target) {
        setCount(Math.ceil(start));
        requestAnimationFrame(step);
      } else {
        setCount(target); // Ensure we hit the target exactly
      }
    };
    requestAnimationFrame(step);
  }, [target]);

  return <h2 className="text-4xl font-bold">{count}</h2>;
};

const FactsSection = () => {
  const [ref, isInView] = useInView(0.1); // Hook to trigger visibility

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-2000 ease-in-out transform ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto py-16">
        <div className="flex flex-wrap">
          {/* Left Section with Title, Description and Call */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 animate-fadeInUp">
            <h6 className="text-secondary font-bold uppercase text-4xl">Some Facts</h6>
            <h1 className="text-4xl font-bold mb-6">#1 Place To Manage All Of Your Shipments</h1>
            <p className="text-lg text-gray-700 mb-6">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum
              et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
            </p>
            <div className="flex items-center">
              <i className="fa fa-headphones text-white bg-primary p-4 rounded-full"></i>
              <div className="ml-4">
                <h6 className="text-lg">Call for any query!</h6>
                <h3 className="text-primary text-2xl">+012 345 6789</h3>
              </div>
            </div>
          </div>

          {/* Right Section with Facts Cards */}
          <div className="w-full lg:w-1/2 flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 px-4 mb-8 lg:mb-0">
              <div className="bg-primary p-6 text-center text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <i className="fa fa-users text-3xl mb-3"></i>
                {isInView && <Counter target={1234} />}
                <p>Happy Clients</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 px-4 mb-8 lg:mb-0">
              <div className="bg-secondary p-6 text-center text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <i className="fa fa-ship text-3xl mb-3"></i>
                {isInView && <Counter target={5678} />}
                <p>Complete Shipments</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 px-4">
              <div className="bg-success p-6 text-center text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <i className="fa fa-star text-3xl mb-3"></i>
                {isInView && <Counter target={91011} />}
                <p>Customer Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactsSection;
