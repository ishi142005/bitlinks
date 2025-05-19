"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-3xl font-extrabold tracking-tight hover:text-indigo-300">
          Bitlinks
        </Link>

        {/* Hamburger icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
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
                pathname === item.href ? "underline underline-offset-4" : "hover:text-indigo-200"
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

        {/* Mobile menu dropdown (corner small menu) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute right-4 top-16 w-40 bg-white text-indigo-700 rounded-lg shadow-lg p-2 z-50">
            {navItems.map((item) => (  // Add this
              <Link                               // Add this
                key={item.href}                     // Add this
                href={item.href}                    // Add this
                className="block px-4 py-2 rounded hover:bg-indigo-100 transition"  // Add this
                onClick={() => setMobileMenuOpen(false)}   // Add this
              >                                  // Add this
                {item.label}                        // Add this
              </Link>                                 // Add this
            ))}                                   // Add this
            {!session ? (
              <Link
                href="/signin"
                className="block text-center px-4 py-2 rounded hover:bg-indigo-100 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded hover:bg-indigo-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}