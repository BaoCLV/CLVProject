
import Link from "next/link";

const navItems = [
  {
    title: "Routes",
    url: "api/routes",
  },
  {
    title: "Track Order",
    url: "/tracking",
  },
  {
    title: "Orders",
    url: "/Orders",
  },
  {
    title: "Contact us",
    url: "/contact",
  },
];

const NavItems = ({ activeItem = 0 }: { activeItem?: number }) => {
  return (
    <div className="md:block hidden">
      {navItems.map((item, index) => (
        <Link
          key={item.url}
          href={item.url}
          className={`px-5 text-[18px] font-Poppins font-[500] text-white ${
            activeItem === index && "text-[#37b668]"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
