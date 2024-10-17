import { useState } from "react";
import { useInView } from "../../../hooks/useInView";
import Image from "next/image";

const services = [
  {
    title: "Air Freight",
    image: "/img/service-1.jpg",
    description: "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
  },
  {
    title: "Ocean Freight",
    image: "/img/service-2.jpg",
    description: "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
  },
  {
    title: "Road Freight",
    image: "/img/service-3.jpg",
    description: "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
  },
  {
    title: "Train Freight",
    image: "/img/service-4.jpg",
    description: "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
  },
];

const ServicesSection = () => {
  const [ref, isInView] = useInView(0.1); // To trigger animations
  const [currentIndex, setCurrentIndex] = useState(0); // Index of first visible item
  const servicesToShow = 3; // Show 3 services at a time
  const servicesLength = services.length;

  const handleNext = () => {
    // Move to the next service, loop back if at the end
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= servicesLength ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    // Move to the previous service, loop back if at the start
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? servicesLength - 1 : prevIndex - 1
    );
  };

  return (
    <div className="overflow-hidden bg-red-400 py-16" ref={ref}>
      <div className="container mx-auto mb-12 text-center">
        <h6 className="text-black font-bold uppercase text-6xl">Our Services</h6>
      </div>

      {/* Service items container */}
      <div className="relative w-full flex items-center">
        {/* Previous Button (occupying 5% of width) */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 h-full w-[5%] bg-transparent hover:bg-red-500 hover:text-white hover:scale-120 transition-all"
        >
          <span className="text-white text-4xl absolute left-3 top-1/2 transform -translate-y-1/2">
            &larr;
          </span>
        </button>

        {/* Scrolling container */}
        <div className="w-[90%] overflow-hidden mx-auto">
          <div
            className="flex transition-transform duration-500 ease-in-out transform"
            style={{
              transform: `translateX(-${
                (currentIndex % servicesLength) * (100 / servicesToShow)
              }%)`,
            }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-[33.33%] p-8" // Set the width to 33.33% to show 3 items at a time
              >
                <div className="bg-white min-h-[600px] p-6 shadow-lg rounded-lg">
                  <div className="overflow-hidden mb-4">
                    <Image
                      src={service.image}
                      alt={service.title}
                      className="w-full h-100 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                  <p className="text-gray-600">{service.description}</p>
                  <a href="#" className="text-blue-600 mt-4 inline-block">
                    <i className="fa fa-arrow-right mr-2"></i>Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button (occupying 5% of width) */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-10 h-full w-[5%] bg-transparent hover:bg-red-500 hover:text-white transition-all"
        >
          <span className="text-white text-4xl absolute right-3 top-1/2 transform -translate-y-1/2">
            &rarr;
          </span>
        </button>
      </div>
    </div>
  );
};

export default ServicesSection;
