// components/Footer.tsx
import { Link } from '@nextui-org/react'; // Correct import for Link from NextUI
import { FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa'; // Import React icons for social media

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="container mx-auto pt-6 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Address Section */}
        <div>
          <h4 className="text-white mb-4">Address</h4>
          <p className="mb-2">
            <i className="fa fa-map-marker-alt mr-3"></i> 123 Street, New York, USA
          </p>
          <p className="mb-2">
            <i className="fa fa-phone-alt mr-3"></i> +012 345 67890
          </p>
          <p className="mb-2">
            <i className="fa fa-envelope mr-3"></i> info@example.com
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaYoutube className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedinIn className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h4 className="text-white mb-4">Services</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Air Freight
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Sea Freight
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Road Freight
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Logistic Solutions
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Industry Solutions
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="text-white mb-4">Newsletter</h4>
          <p className="mb-4">Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
          <div className="relative">
            <input
              type="text"
              className="w-full py-3 pl-4 pr-20 bg-gray-800 text-gray-300 border-none rounded-md"
              placeholder="Your email"
            />
            <button className="absolute top-0 right-0 mt-2 mr-2 py-2 px-4 bg-blue-600 text-white rounded-md">
              SignUp
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-gray-800 py-4 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left text-gray-400">
            &copy; 2024 Logistica, All Rights Reserved.
          </p>
          <p className="text-center md:text-right text-gray-400">
            Designed by{' '}
            <Link href="https://htmlcodex.com" color="secondary" className="text-blue-400">
              BAO
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
