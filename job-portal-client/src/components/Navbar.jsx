import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBarsStaggered as FaBar, FaXmark } from "react-icons/fa6";
import { useAuthContext } from "../hooks/useAuthContext";
import { IoLogOutOutline } from "react-icons/io5";
import { MdDashboard, MdWork, MdSearch, MdAttachMoney } from "react-icons/md";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthContext();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClick = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Common nav items for all users
  const commonNavItems = [
    {
      title: "Job Search",
      path: "/",
      icon: <MdSearch className="text-lg" />,
    },
    {
      title: "Salary Estimate",
      path: "/salary",
      icon: <MdAttachMoney className="text-lg" />,
    },
  ];

  // Role-specific nav items
  const roleBasedNavItems = {
    "job-seeker": [
      {
        title: "My Applications",
        path: `/my-jobs/${user?._id}`,
        icon: <MdWork className="text-lg" />,
      },
    ],
    employer: [
      {
        title: "Post a Job",
        path: "/post-job",
        icon: <MdWork className="text-lg" />,
      },
      {
        title: "My Jobs",
        path: `/my-jobs/${user?._id}`,
        icon: <MdDashboard className="text-lg" />,
      },
    ],
    admin: [
      {
        title: "Dashboard",
        path: "/admin",
        icon: <MdDashboard className="text-lg" />,
      },
    ],
  };

  // Combine nav items based on role
  const getNavItems = () => {
    if (!user) return commonNavItems;
    return [...commonNavItems, ...(roleBasedNavItems[user.role] || [])];
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <nav className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-600"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 absolute -left-1 -top-1"></div>
              <div className="w-8 h-8 rounded-full bg-blue-600 relative z-10 flex items-center justify-center">
              </div>
            </div>
            <span className="hidden sm:inline-block">TechPoster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {getNavItems().map(({ path, title, icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-1 font-medium px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    {icon}
                    {title}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* User Actions */}
            <div className="flex items-center gap-4 ml-4">
              {user ? (
                <>
                  <div className="relative group">
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 hover:border-blue-400 transition-all"
                      />
                      <span className="font-medium text-gray-700 hidden lg:inline-block">
                        {user.username}
                      </span>
                    </Link>
                  </div>
                  <button
                    onClick={handleClick}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors"
                    title="Sign out"
                  >
                    <IoLogOutOutline className="text-xl" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to={`/profile/${user._id}`} className="flex items-center">
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-blue-200"
                />
              </Link>
            )}
            <button
              onClick={handleMenuToggler}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <FaXmark className="w-5 h-5 text-gray-700" />
              ) : (
                <FaBar className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-screen py-4" : "max-h-0 py-0"
          }`}
        >
          <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            <ul className="space-y-2">
              {getNavItems().map(({ path, title, icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={handleMenuToggler}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {icon}
                    {title}
                  </NavLink>
                </li>
              ))}
              {user ? (
                <li>
                  <button
                    onClick={() => {
                      handleClick();
                      handleMenuToggler();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50"
                  >
                    <IoLogOutOutline className="text-xl" />
                    Sign Out
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={handleMenuToggler}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={handleMenuToggler}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
