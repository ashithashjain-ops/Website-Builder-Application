/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaBookOpen,
  FaBriefcase,
  FaBuilding,
  FaCartShopping,
  FaCamera,
  FaChartLine,
  FaChevronDown,
  FaGraduationCap,
  FaHeart,
  FaHotel,
  FaMagnifyingGlass,
  FaNewspaper,
  FaPenNib,
  FaUtensils,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { assetPath } from "@/lib/paths";

const products = ["Premium Templates", "UI Kits", "WordPress Themes", "Free Assets"];

const navCategories = [
  {
    title: "Landing Page",
    icon: FaBookOpen,
    items: ["Lead Generating", "Click-through", "Sales", "Product", "App", "Event"],
  },
  {
    title: "Dashboard",
    icon: FaChartLine,
    items: ["Admin Analytics", "Overview", "Profile", "Sales", "Marketing", "Finance"],
  },
  {
    title: "Portfolio",
    icon: FaBriefcase,
    items: ["Designer", "Developer", "Agency", "Minimal", "Personal", "Freelancer"],
  },
  {
    title: "Food",
    icon: FaUtensils,
    items: ["Burger House", "Pizza Corner", "Fresh & Natural", "Food Stories"],
  },
  {
    title: "Real Estate",
    icon: FaBuilding,
    items: ["Luxury", "Commercial", "Residential", "Vacation Rental", "Portal"],
  },
  {
    title: "Hotel",
    icon: FaHotel,
    items: ["Resort", "Luxury", "Eco Stay", "Business", "Boutique"],
  },
  {
    title: "Blog",
    icon: FaPenNib,
    items: ["Corporate", "Travel", "Food", "News", "Finance", "Education"],
  },
  {
    title: "Education",
    icon: FaGraduationCap,
    items: ["EduSpark", "LearnSphere", "Skillbridge", "NextGen"],
  },
  {
    title: "Newspaper",
    icon: FaNewspaper,
    items: ["Daily Pulse", "Global Times", "NextWave", "Prime Report"],
  },
  {
    title: "Photography",
    icon: FaCamera,
    items: ["Wedding", "Fashion", "Studio", "Travel", "Events", "Food"],
  },
];

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06224C] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-8">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <FaXmark /> : <FaBars />}
          </button>

          <Link
            href="/"
            className="inline-flex aspect-[2/1] min-w-[82px] items-center justify-center rounded-[60%] bg-white px-3 py-2 shadow-md transition hover:scale-105 md:min-w-[96px]"
            aria-label="Stackly home"
          >
            <img src={assetPath("/stackly-logo.webp")} alt="Stackly" className="h-4 w-auto object-contain md:h-5" />
          </Link>

          <div className="hidden items-center gap-7 text-[13px] font-bold uppercase tracking-wide text-white lg:flex">
            <Link href="/" className="hover:text-blue-300">Home</Link>
            <a href="#features" className="hover:text-blue-300">About Us</a>

            <div className="group relative">
              <button type="button" className="inline-flex items-center gap-1.5 hover:text-blue-300">
                Our Products <FaChevronDown className="text-[10px]" />
              </button>
              <div className="invisible absolute left-0 top-full w-52 translate-y-2 rounded-xl border border-gray-100 bg-white py-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {products.map((product) => (
                  <a key={product} href="#templates" className="block border-b border-gray-50 px-5 py-2.5 text-[11px] font-black text-gray-800 last:border-0 hover:bg-blue-50 hover:text-blue-600">
                    {product}
                  </a>
                ))}
              </div>
            </div>

            <div className="group relative">
              <button type="button" className="inline-flex items-center gap-1.5 hover:text-blue-300">
                Categories <FaChevronDown className="text-[10px]" />
              </button>
              <div className="invisible absolute left-0 top-full grid w-[560px] translate-y-2 grid-cols-2 gap-1 rounded-xl border border-gray-100 bg-white p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {navCategories.map(({ title, icon: Icon, items }) => (
                  <a key={title} href="#categories" className="group/item rounded-lg px-3 py-2 hover:bg-blue-50">
                    <span className="flex items-center gap-2 text-[11px] font-black text-gray-900">
                      <Icon className="text-gray-400 group-hover/item:text-blue-600" />
                      {title}
                    </span>
                    <span className="mt-1 block truncate text-[10px] font-semibold normal-case tracking-normal text-gray-500">
                      {items.slice(0, 4).join(", ")}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <a href="#contact" className="hover:text-blue-300">Contact</a>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <a href="#templates" aria-label="Cart" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#06224C] shadow-sm transition hover:bg-gray-100">
            <FaCartShopping className="text-sm" />
          </a>
          <a href="#templates" aria-label="Wishlist" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-gray-100">
            <FaHeart className="text-sm" />
          </a>
          <a href="#templates" aria-label="Search" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#06224C] shadow-sm transition hover:bg-gray-100">
            <FaMagnifyingGlass className="text-sm" />
          </a>
          <Link href="/login" aria-label="Login" className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-[#06224C]">
            <FaUser className="text-sm" />
          </Link>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#06224C] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white lg:hidden">
          <div className="flex flex-col">
            <Link href="/" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-3">Home</Link>
            <a href="#features" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-3">About Us</a>
            <a href="#templates" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-3">Our Products</a>
            <a href="#categories" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-3">Categories</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="py-3">Contact</a>
          </div>
        </div>
      )}
    </header>
  );
}
