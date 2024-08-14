import Link from "next/link";
import styles from "../../utils/styles";
import NavItems from "../NavItems";
import UserDropDown from "../UserDropdown";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#0A0713] z-50 shadow-md">
      <div className="w-[90%] m-auto h-[80px] flex items-center justify-between text-white">
        <Link href="/" passHref>
          <h1 className={`${styles.logo} cursor-pointer`}>CLVSHIPPING</h1>
        </Link>
        <NavItems />
        <UserDropDown />
      </div>
    </header>
  );
};

export default Header;
