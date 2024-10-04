import UserDropDown from "../../UserDropdown";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar fixed top-0 left-0 w-full bg-white shadow-lg z-50">
        <div className="mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <a href="/" className="flex items-left">
            <img
              src="https://cyberlogitec.com.vn/wp-content/uploads/2024/09/logo-ngang_3-1.svg"
              alt="Logo"
              className="h-5" /* Adjust height to fit navbar */
            />
          </a>

          {/* Navigation Links */}
          <div className="flex space-x-10">
            <a
              href="/"
              className="text-lg text-gray-700 hover:text-red-600 hover:underline transition duration-300 ease-in-out"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-lg text-gray-700 hover:text-red-600 hover:underline transition duration-300 ease-in-out"
            >
              About
            </a>
            <a
              href="/services"
              className="text-lg text-gray-700 hover:text-red-600 hover:underline transition duration-300 ease-in-out"
            >
              Services
            </a>
            <a
              href="/contact"
              className="text-lg text-gray-700 hover:text-red-600 hover:underline transition duration-300 ease-in-out"
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
