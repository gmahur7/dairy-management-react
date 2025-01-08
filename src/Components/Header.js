import React, { Fragment, useState } from "react";
import { LuMilk } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { FaRegWindowClose } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = ({ toggleTheme, theme }) => {
  const [mobileNav, setMobileNav] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    window.location = "/";
  };

  return (
    <Fragment>
      <header className="bg-light-headerBg text-light-headerText dark:bg-dark-headerBg dark:text-dark-headerText py-4">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-10 rounded-lg">
            
          {/* Logo */}
          <div>
            <h4 className="flex text-2xl items-center">
              Dairy Management
              <span className="text-2xl ml-1 font-bold">
                <LuMilk/>
              </span>
            </h4>
          </div>

          {/* Navigation */}
          <div className="hidden sm:flex items-center gap-12">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  to="/"
                  className="text-light hover:text-info flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM11 13V19H13V13H11Z"></path>
                  </svg>
                  <span className="hidden md:block">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/milkentry"
                  className="text-light hover:text-info flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M5 8V20H19V8H5ZM5 6H19V4H5V6ZM20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 10H11V14H7V10ZM7 16H17V18H7V16ZM13 11H17V13H13V11Z"></path>
                  </svg>
                  <span className="hidden md:block">MilkEntry</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor"
                  className="text-light hover:text-info flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path>
                  </svg>
                  <span className="hidden md:block">Vendor</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/details"
                  className="text-light hover:text-info flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M5 3V19H21V21H3V3H5ZM19.9393 5.93934L22.0607 8.06066L16 14.1213L13 11.121L9.06066 15.0607L6.93934 12.9393L13 6.87868L16 9.879L19.9393 5.93934Z"></path>
                  </svg>
                  <span className="hidden md:block">Details</span>
                </Link>
              </li>
              <li onClick={logout}>
                <button className="text-light hover:text-info flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM19 17.5858L21.1213 15.4645L22.5355 16.8787L20.4142 19L22.5355 21.1213L21.1213 22.5355L19 20.4142L16.8787 22.5355L15.4645 21.1213L17.5858 19L15.4645 16.8787L16.8787 15.4645L19 17.5858Z"></path>
                  </svg>
                  <span className="hidden md:block">Logout</span>
                </button>
              </li>
            </ul>

            <button onClick={toggleTheme} className="text-light">
              {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="text-light text-2xl"
            >
              <RiMenuUnfoldLine />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileNav && (
        <MobileNav toggleTheme={toggleTheme} theme={theme} close={setMobileNav} value={mobileNav} logout={logout} />
      )}
    </Fragment>
  );
};

export default Header;

export const MobileNav = ({ close, value, logout,toggleTheme,theme }) => {
  return (
      <header className="min-h-screen min-w-[70%] z-50 bg-light-secondary text-light-headerText dark:bg-black dark:text-dark-headerText fixed right-0 top-0 py-3 px-5">
        <div className="flex justify-between items-center mb-5">
          <div className="text-start">
            <h4 className="text-main">
              Dairy
              <span className="text-white text-2xl">
                <LuMilk />
              </span>
            </h4>
          </div>
          <div className="text-end">
            <button onClick={() => close(!value)} className="text-main bg-sec">
              <FaRegWindowClose className="text-2xl text-main" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <ul className="flex flex-col gap-4 list-none text-sm">
              <li>
                <Link
                  className="text-light no-underline flex items-center gap-2"
                  to="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM11 13V19H13V13H11Z"></path>
                  </svg>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  className="text-light no-underline flex items-center gap-2"
                  to="/milkentry"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M5 8V20H19V8H5ZM5 6H19V4H5V6ZM20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 10H11V14H7V10ZM7 16H17V18H7V16ZM13 11H17V13H13V11Z"></path>
                  </svg>
                  <span>MilkEntry</span>
                </Link>
              </li>
              <li>
                <Link
                  className="text-light no-underline flex items-center gap-2"
                  to="/vendor"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path>
                  </svg>
                  <span>Vendor</span>
                </Link>
              </li>
              <li>
                <Link
                  className="text-light no-underline flex items-center gap-2"
                  to="/details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="25"
                    height="25"
                    fill="currentColor"
                  >
                    <path d="M5 3V19H21V21H3V3H5ZM19.9393 5.93934L22.0607 8.06066L16 14.1213L13 11.121L9.06066 15.0607L6.93934 12.9393L13 6.87868L16 9.879L19.9393 5.93934Z"></path>
                  </svg>
                  <span>Details</span>
                </Link>
              </li>
              <li onClick={logout}>
                <Link
                  className="text-light no-underline flex items-center gap-2"
                  to="/#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM19 17.5858L21.1213 15.4645L22.5355 16.8787L20.4142 19L22.5355 21.1213L21.1213 22.5355L19 20.4142L16.8787 22.5355L15.4645 21.1213L17.5858 19L15.4645 16.8787L16.8787 15.4645L19 17.5858Z"></path>
                  </svg>
                  <span>Logout</span>
                </Link>
              </li>
            <li onClick={toggleTheme} className="text-light">
              {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
            </li>
            </ul>
          </div>
        </div>
      </header>
  );
};
