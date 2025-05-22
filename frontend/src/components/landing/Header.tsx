import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { NavHashLink as Link } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface HeaderProps {
  isMobile: boolean;
}

export default function Header({ isMobile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, [location]); // re-check login status on route change

  // Add scroll listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (targetPath: string) => location.hash === targetPath;
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-md border-b border-gray-100/50 dark:border-gray-800/50 py-3"
          : "bg-white/40 dark:bg-black/30 backdrop-blur-sm py-5"
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tighter text-black dark:text-white"
        >
          EAZY
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent font-extrabold">
            PARKING
          </span>
        </Link>

        {isMobile ? (
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        ) : (
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {["features", "locations", "testimonials", "contact"].map(
              (item) => (
                <Link
                  key={item}
                  smooth
                  to={`#${item}`}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive(`#${item}`)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              )
            )}

            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              {isLoggedIn ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                >
                  Dashboard
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 px-4 py-1.5 text-sm font-medium transition-all duration-200"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                  >
                    <Link to="/admin/login">Admin</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>

      {isMobile && isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-lg"
        >
          <nav className="flex flex-col py-3 px-6 space-y-1">
            {["features", "locations", "testimonials", "contact"].map(
              (item) => (
                <Link
                  key={item}
                  to={`#${item}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    isActive(`#${item}`)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              )
            )}

            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 grid gap-2">
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg py-3 font-medium shadow-sm"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 py-3 font-medium"
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 text-white rounded-lg py-3 font-medium shadow-sm"
                  >
                    <Link
                      to="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
