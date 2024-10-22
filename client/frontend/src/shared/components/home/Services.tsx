import { useInView } from "../../../hooks/useInView";
import Image from "next/image";
import Slider from "react-slick"; // Import Slick
import "slick-carousel/slick/slick.css"; // Import Slick styles
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

// Sample service data
const services = [
  {
    title: "Air Freight",
    image: "/img/service-1.jpg",
    description: "Efficient air transport solutions for global logistics.",
  },
  {
    title: "Ocean Freight",
    image: "/img/service-2.jpg",
    description: "Reliable and cost-effective ocean freight services.",
  },
  {
    title: "Road Freight",
    image: "/img/service-3.jpg",
    description: "Flexible and scalable road transport solutions.",
  },
  {
    title: "Train Freight",
    image: "/img/service-4.jpg",
    description: "Seamless railway logistics for long-distance cargo.",
  },
];

// Custom Left Arrow for the Carousel
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    className="absolute left-0 z-20 text-white bg-gradient-to-r from-blue-600 to-indigo-500 p-4 rounded-full hover:scale-110 hover:shadow-lg transition-transform"
    style={{ top: "45%" }}
    onClick={onClick}
  >
    <span className="text-2xl">&larr;</span>
  </button>
);

// Custom Right Arrow for the Carousel
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    className="absolute right-0 z-20 text-white bg-gradient-to-r from-blue-600 to-indigo-500 p-4 rounded-full hover:scale-110 hover:shadow-lg transition-transform"
    style={{ top: "45%" }}
    onClick={onClick}
  >
    <span className="text-2xl">&rarr;</span>
  </button>
);

const ServicesSection = () => {
  const [ref, isInView] = useInView(0.1); // To trigger animations

  // Slick carousel settings with custom arrows
  const settings = {
    dots: true, // Enable dots navigation
    infinite: true, // Infinite loop
    speed: 500,
    slidesToShow: 3, // Show 3 slides at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, // Custom right arrow
    prevArrow: <PrevArrow />, // Custom left arrow
    responsive: [
      {
        breakpoint: 1024, // For medium-sized devices
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // For small devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Parallax state to track scroll position
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative  overflow-hidden py-24"
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 backdrop-blur-md transform"
        style={{ transform: `translateY(${offsetY * 0.2}px)` }} // Parallax effect
      ></div>

      {/* Heading */}
      <div className="relative z-10 container mx-auto mb-12 text-center">
        <h6 className="text-6xl font-extrabold uppercase mb-16 tracking-wide animate-fadeIn">
          Our Services
        </h6>
      </div>

      {/* Slick Carousel */}
      <div className="relative w-full">
        <Slider {...settings}>
          {services.map((service, index) => (
            <div key={index} className="px-4">
              <div className="bg-white/20 backdrop-blur-md p-8 shadow-lg rounded-xl min-h-[600px] transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/40">
                <div className="overflow-hidden rounded-lg mb-6">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-72 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    width={600}
                    height={400}
                  />
                </div>
                <h4 className="text-3xl font-bold mb-4 transition-colors duration-300 group-hover:text-indigo-100">
                  {service.title}
                </h4>
                <p className="text-lg text-indigo-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <a
                  href="#"
                  className=" font-semibold mt-6 inline-block group-hover:scale-105 hover:underline transition-transform duration-300 ease-in-out"
                >
                  <i className="fa fa-arrow-right mr-2"></i> Read More
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ServicesSection;
