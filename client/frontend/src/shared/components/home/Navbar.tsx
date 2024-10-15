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
      <nav className="navbar fixed top-0 left-0 w-full bg-white shadow-lg z-50">
        <div className=" flex mx-auto justify-between items-center p-4">
          {/* Logo */}
          <a href="/" className="flex items-left hover:scale-110 transition-transform duration-200">
            <img
              src="https://cyberlogitec.com.vn/wp-content/uploads/2024/09/logo-ngang_3-1.svg"
              alt="Logo"
              className="h-8 pl-5"
            />
          </a>

          {/* Navigation Links */}
          <div className="flex space-x-10 relative">
            <a
              href="/"
              className={`text-lg font-bold ${
                pathname === "/" ? "text-red-600 underline" : "text-gray-700"
              } hover:text-red-600 hover:underline transition duration-300 ease-in-out`}
            >
              Home
            </a>
            <a
              href="/Page/About"
              className={`text-lg font-bold ${
                pathname === "/Page/About" ? "text-red-600 underline" : "text-gray-700"
              } hover:text-red-600 hover:underline transition duration-300 ease-in-out`}
            >
              About
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`text-lg font-bold ${
                  pathname === "/services" ? "text-red-600 underline" : "text-gray-700"
                } hover:text-red-600 hover:underline transition duration-300 ease-in-out`}
              >
                Services
              </button>

              {/* Dropdown Menu with Smooth Transition */}
              <div
                ref={dropdownRef}
                className={`absolute top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform ${
                  dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                {services.map((service) => (
                  <a
                    key={service.title}
                    href={`/Page/services/${service.title.toLowerCase().replace(/ /g, "-")}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600 transition duration-150 ease-in-out"
                  >
                    {service.title}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/contact"
              className={`text-lg font-bold ${
                pathname === "/contact" ? "text-red-600 underline" : "text-gray-700"
              } hover:text-red-600 hover:underline transition duration-300 ease-in-out`}
            >
              Contact
            </a>
          </div>

          {/* User Dropdown */}
          <ul className="flex items-center flex-shrink-0 space-x-6">
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
