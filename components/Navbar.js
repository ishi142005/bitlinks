"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Link href="/" className="text-3xl font-extrabold tracking-tight hover:text-indigo-300">
          Bitlinks
        </Link>

        {/* Hamburger icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all duration-300 ${
                pathname === item.href
                  ? "underline underline-offset-4"
                  : "hover:text-indigo-200"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {!session ? (
            <Link
              href="/signin"
              className="bg-white text-indigo-700 px-6 py-2 rounded-full hover:bg-indigo-100 transition-all font-medium shadow-lg"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-700 px-6 py-2 rounded-full hover:bg-indigo-100 transition-all font-medium shadow-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 ${
                pathname === item.href
                  ? "underline underline-offset-4"
                  : "hover:text-indigo-200"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {!session ? (
            <Link
              href="/signin"
              className="bg-white text-indigo-700 text-center py-2 rounded-full hover:bg-indigo-100 transition font-medium shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="bg-white text-indigo-700 py-2 rounded-full hover:bg-indigo-100 transition font-medium shadow-lg"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </motion.nav>
  );
}
