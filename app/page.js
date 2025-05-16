"use client";

import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

const poppins = localFont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});

export default function Home() {
  const leftRef = useRef(null);
  const imageRef = useRef(null);
  const button1Ref = useRef(null);

  useEffect(() => {
    animate(leftRef.current, { opacity: [0, 1], x: [-50, 0] }, { duration: 0.8 });
    animate(imageRef.current, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.8 });
    animate(button1Ref.current, { scale: [1, 1.05, 1] }, {
      duration: 0.6,
      delay: 1,
      repeat: Infinity,
      repeatType: "reverse"
    });
  }, []);

  return (
    <main className="bg-gradient-to-br from-[#eef2f7] via-[#e3e8f0] to-[#f0f4fc] min-h-screen text-gray-800">
      <section className="grid grid-cols-1 md:grid-cols-2 w-11/12 max-w-7xl mx-auto items-center gap-10 py-20">
        {/* Left Section */}
        <div
          ref={leftRef}
          className="flex flex-col gap-6 text-center md:text-left"
        >
          <h1
            className={`text-5xl md:text-6xl font-extrabold leading-tight text-slate-800 ${poppins.className}`}
          >
            BitLinks:
            <br />
            <span className="text-indigo-500">Secure. Simple. Styled.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
            Create and manage short, branded links effortlessly. All from a beautifully designed interface built with care.
          </p>

          <div className="flex gap-4 justify-center md:justify-start mt-4">
            <Link href="/shorten">
              <button
                ref={button1Ref}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </button>
            </Link>
            <Link href="/about">
              <button className="border border-indigo-500 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div
          ref={imageRef}
          className="relative flex justify-center md:justify-end"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-indigo-100">
            <Image
              className="w-full h-auto"
              alt="BitLinks Hero"
              src="/vector1.jpg"
              width={580}
              height={580}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
