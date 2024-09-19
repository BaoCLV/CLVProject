// components/Footer.tsx
import { Link } from '@nextui-org/react'; // Correct import for Link from NextUI

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white z-100 py-5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">&copy; 2024 Logistica, All Rights Reserved.</p>
        <p className="text-center md:text-right">
          Designed by{' '}
          <Link href="/" color="secondary">
            BAO
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
