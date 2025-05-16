"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  if (session) {
    navItems.push({ href: "/shorten", label: "Shorten" });
    navItems.push({ href: "/profile", label: "Profile" });
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-indigo-500 text-white px-6 py-4 shadow-md sticky top-0 z-50 font-semibold"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight hover:text-indigo-300 transition-colors duration-300"
        >
          Bitlinks
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          {navItems.map((item) => (
            <motion.div
              key={item.href}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={item.href}
                className={`transition-all duration-300 ${
                  pathname === item.href
                    ? "underline underline-offset-4 text-white"
                    : "text-white hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          {/* Login/Logout Button */}
          {!session ? (
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href="/signin"
                className="bg-white text-indigo-700 px-6 py-3 rounded-full hover:bg-indigo-100 transition-all font-medium shadow-lg"
              >
                Login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-700 px-6 py-3 rounded-full hover:bg-indigo-100 transition-all font-medium shadow-lg"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
