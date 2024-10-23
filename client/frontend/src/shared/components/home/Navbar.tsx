'use client'

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import UserDropDown from "../../UserDropdown";

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

const Navbar = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const closeTimeout = useRef<any>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <div>
      <nav className="navbar fixed top-0 left-0 w-full bg-white/20 backdrop-blur-md shadow-lg z-[1000] transition-all duration-500 ease-in-out hover:bg-white/50">
        <div className=" mx-auto flex justify-between items-center py-4 px-8">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src="https://cyberlogitec.com.vn/wp-content/uploads/2024/09/logo-ngang_3-1.svg"
              alt="Logo"
              className="h-12 drop-shadow-md"
            />
          </a>

          {/* Navigation Links */}
          <div className="flex space-x-16">
            <a
              href="/"
              className={`text-lg font-semibold transition-all duration-300 ${
                pathname === "/" ? "text-red-500 underline" : "text-black"
              } hover:text-red-500 hover:scale-110 hover:underline`}
            >
              Home
            </a>
            <a
              href="/Page/About"
              className={`text-lg font-semibold transition-all duration-300 ${
                pathname === "/Page/About" ? "text-red-500 underline" : "text-black"
              } hover:text-red-500 hover:scale-110 hover:underline`}
            >
              About
            </a>

            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`text-lg font-semibold transition-all duration-300 ${
                  pathname === "/services" ? "text-red-500 underline" : "text-black"
                } hover:text-red-500 hover:scale-110 hover:underline`}
              >
                Services
              </button>

              {/* Dropdown Menu */}
              <div
                ref={dropdownRef}
                className={`absolute top-full mt-4 w-60 bg-white backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg transition-all duration-500 ease-in-out transform group-hover:translate-y-0 ${
                  dropdownOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5 pointer-events-none"
                }`}
              >
                {services.map((service) => (
                  <a
                    key={service.title}
                    href={`/Page/services/${service.title
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    className="block px-6 py-4 text-gray-800 hover:bg-gray-200 hover:shadow-md rounded-lg transition-all duration-300"
                  >
                    {service.title}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/contact"
              className={`text-lg font-semibold transition-all duration-300 ${
                pathname === "/contact" ? "text-red-500 underline" : "text-black"
              } hover:text-red-500 hover:scale-110 hover:underline`}
            >
              Contact
            </a>
          </div>

          {/* User Dropdown */}
          <ul className="flex items-center space-x-8">
            <li>
              <UserDropDown />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
