"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaShieldAlt,
  FaMagic,
  FaChartLine,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt size={28} className="text-indigo-500" />,
    title: "Secure & Private",
    desc: "Links are saved to your account with full security and privacy.",
  },
  {
    icon: <FaMagic size={28} className="text-indigo-500" />,
    title: "Custom Short Links",
    desc: "Craft clean, memorable links with personalized endings.",
  },
  {
    icon: <FaChartLine size={28} className="text-indigo-500" />,
    title: "Manage with Ease",
    desc: "Edit, copy, or delete links from a beautiful dashboard.",
  },
];

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf4] to-[#f0f4fc] text-gray-800 py-16 px-6 md:px-24">
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
          Discover <span className="text-indigo-500">BitLinks</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Your secure, stylish, and personalized URL shortener built for ease and elegance.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <section className="grid gap-10 md:grid-cols-3 mb-24">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className="backdrop-blur-md bg-white/60 border border-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 h-full">
              <CardContent className="flex flex-col items-center text-center gap-4">
                {feature.icon}
                <h3 className="text-lg font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </CardContent>
            </div>
          </motion.div>
        ))}
      </section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          How It Works
        </h2>
        <p className="text-base text-gray-700">
          Sign in, paste your long URL, optionally give it a name, and click “Shorten.” Your personalized BitLink is ready — and stored in your dashboard for access and sharing.
        </p>
      </motion.section>

      {/* Social Icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center gap-8"
      >
        <Link href="https://github.com/ishi142005" target="_blank">
          <FaGithub size={30} className="text-gray-700 hover:text-black transition" />
        </Link>
        <Link href="https://www.linkedin.com/in/ishita-kanaujia-3735342b1/" target="_blank">
          <FaLinkedin size={30} className="text-indigo-500 hover:text-indigo-700 transition" />
        </Link>
      </motion.div>
    </main>
  );
};

export default About;
