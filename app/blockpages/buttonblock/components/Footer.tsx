"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Send, Globe } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }

    // clear input
    setEmail("");
    setEmailError("");

    // show success message
    alert("Thank you for subscribing!");
  }

  return (
    <footer className="grow bg-[#051b3b] text-white mt-16 py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-8 md:col-span-1">
            <form
              onSubmit={handleEmailSubmit}
              className="max-w-[260px] flex flex-col items-start gap-1"
            >
              <div className="flex items-center gap-2 w-full">
                {/* INPUT */}
                <div className="flex-grow relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-full bg-white text-black text-sm outline-none placeholder-gray-700 border border-gray-700 shadow-sm focus:shadow-md focus:ring-2 ${emailError ? "ring-2 ring-red-500 focus:ring-red-500 border-red-500" : "focus:ring-blue-400 focus:border-blue-400"}`}
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="text-white hover:text-blue-300 transition group shrink-0"
                >
                  <Send className="text-lg w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
              {emailError && (
                <span className="text-red-400 text-xs ml-3 font-medium">{emailError}</span>
              )}
            </form>

            {/* ADDRESS */}
            <div>
              <h4 className="font-bold text-white mb-3 text-[15px]">Headquarters</h4>
              <p>MMR Complex, Salem,</p>
              <p>Tamil Nadu 636008</p>
            </div>
          </div>

          {/* PRODUCT */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white text-[18px]">Product</h3>
            <ul className="flex flex-col gap-3 text-[15px] text-white">
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Features
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Templates
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Pricing
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Changelog
              </Link>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white text-[18px]">Resources</h3>
            <ul className="flex flex-col gap-3 text-[15px] text-white">
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Documentation
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                API Reference
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Blog
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Status
              </Link>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white text-[18px]">Company</h3>
            <ul className="flex flex-col gap-3 text-[15px] text-white">
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                About
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Terms of Service
              </Link>
              <Link href="/page-not-found" className="transition-all duration-300 hover:text-gray-300 hover:translate-x-1 cursor-pointer">
                Contact
              </Link>
            </ul>
          </div>

          {/* LOGO & DESC */}
          <div className="flex flex-col gap-6 items-start md:items-end text-left md:text-right">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="flex h-10 w-fit items-center justify-center rounded-[50%] bg-white px-4 transition hover:scale-105"
              >
                <Image
                  src="/stackly-logo1.png"
                  alt="Stackly logo"
                  width={104}
                  height={20}
                  unoptimized
                  className="h-[18px] w-auto"
                />
              </Link>
            </div>

            <p className="text-[14px] text-white/70 max-w-[220px]">
              The <strong className="text-white">NO-CODE</strong> website builder for everyone. Powered by AWS infrastructure, built by <strong className="text-white">The Stackly team.</strong>
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* SOCIAL ICONS */}
          <div className="bg-white rounded-full px-5 py-2.5 flex items-center gap-4 text-[#051b3b]">
            <a
              href="https://www.facebook.com/thestackly/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly on Facebook"
              className="hover:scale-110 hover:text-blue-600 transition"
            >
              <FaFacebookF size={14} aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@TheStackly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly on YouTube"
              className="hover:scale-110 hover:text-red-600 transition"
            >
              <FaYoutube size={14} aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/the_stackly/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly on Instagram"
              className="hover:scale-110 hover:text-pink-600 transition"
            >
              <FaInstagram size={14} aria-hidden="true" />
            </a>
            <a
              href="https://x.com/the_stackly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly on X (Twitter)"
              className="hover:scale-110 hover:text-black transition"
            >
              <FaXTwitter size={14} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/the-stackly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly on LinkedIn"
              className="hover:scale-110 hover:text-blue-700 transition"
            >
              <FaLinkedinIn size={14} aria-hidden="true" />
            </a>
            <a
              href="https://stackly.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stackly website"
              className="hover:scale-110 hover:text-green-600 transition"
            >
              <Globe size={14} aria-hidden="true" />
            </a>
          </div>

          {/* COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-[13px] text-white/50">
            <Link href="/page-not-found" className="hover:text-white transition">
              Terms of Use
            </Link>
            <Link href="/page-not-found" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span>© 2018-2026 thestackly.com, Inc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
