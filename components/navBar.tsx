/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
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
  FaHotel,
  FaMagnifyingGlass,
  FaNewspaper,
  FaPenNib,
  FaUtensils,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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

type NavBarProps = {
  wishlistCount?: number;
  onWishlistClick?: () => void;
};

type StoredCommerceItem = {
  title?: string;
  name?: string;
  type?: string;
  price?: number;
  image?: string;
  alt?: string;
  quantity?: number;
  qty?: number;
};

const STORAGE_SYNC_EVENT = "stackly-storage-change";

function readRawJsonArray(key: string): unknown[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readJsonArray(key: string): StoredCommerceItem[] {
  return readRawJsonArray(key).filter(
    (item): item is StoredCommerceItem => Boolean(item) && typeof item === "object",
  );
}

function normalizeStoredItem(item: StoredCommerceItem) {
  return {
    title: item.title || item.name || "Saved item",
    type: item.type || "Template",
    price: typeof item.price === "number" ? item.price : 0,
    image: item.image || "/stackly-logo.webp",
    alt: item.alt || item.title || item.name || "Saved item",
    quantity: item.quantity || item.qty || 1,
  };
}

export default function NavBar({ wishlistCount: wishlistCountProp, onWishlistClick }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<StoredCommerceItem[]>([]);
  const [cartItems, setCartItems] = useState<StoredCommerceItem[]>([]);
  const [activePanel, setActivePanel] = useState<"wishlist" | "cart" | null>(null);

  const scrollLandingSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string, closeMobile = false) => {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    if (currentPath !== "/landing") {
      if (closeMobile) {
        setMobileOpen(false);
      }
      return;
    }

    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `/landing#${sectionId}`);

    if (closeMobile) {
      setMobileOpen(false);
    }
  };

  const refreshStoredCommerce = () => {
    const wishlist = readJsonArray("wishlistItems");
    const cart = readJsonArray("cartItems");
    const cartCount = Number.parseInt(window.localStorage.getItem("cartCount") || "", 10);

    setWishlistItems(wishlist);
    setCartItems(
      [
        ...cart,
        ...(Number.isFinite(cartCount) && cartCount > 0 && cart.length === 0
          ? [{ title: "Cart item", quantity: cartCount }]
          : []),
      ],
    );
  };

  useEffect(() => {
    const refreshTimer = window.setTimeout(refreshStoredCommerce, 0);

    const handleStorageUpdate = () => refreshStoredCommerce();

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener(STORAGE_SYNC_EVENT, handleStorageUpdate);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener(STORAGE_SYNC_EVENT, handleStorageUpdate);
    };
  }, []);

  const wishlistCount = wishlistCountProp ?? wishlistItems.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);

  const removeWishlistItem = (title: string) => {
    const next = wishlistItems.filter((item) => (item.title || item.name) !== title);
    window.localStorage.setItem("wishlistItems", JSON.stringify(next));
    window.dispatchEvent(new Event(STORAGE_SYNC_EVENT));
  };

  const removeCartItem = (title: string) => {
    const next = cartItems.filter((item) => (item.title || item.name) !== title);
    const nextCount = next.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);
    window.localStorage.setItem("cartItems", JSON.stringify(next));
    window.localStorage.setItem("cartCount", String(nextCount));
    window.dispatchEvent(new Event(STORAGE_SYNC_EVENT));
  };

  return (
    <>
    <header className="stackly-navbar sticky top-0 z-50 border-b border-white/10 bg-[#06224C]/95 shadow-[0_14px_40px_rgba(2,15,38,0.22)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-8">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/10 active:scale-95 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <FaXmark /> : <FaBars />}
          </button>

          <Link
            href="/landing"
            className="group/logo inline-flex aspect-[2/1] min-w-[82px] items-center justify-center rounded-[60%] bg-white px-3 py-2 shadow-[0_10px_24px_rgba(255,255,255,0.18)] ring-1 ring-white/50 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_16px_34px_rgba(255,255,255,0.26)] md:min-w-[96px]"
            aria-label="Stackly home"
          >
            <img src={assetPath("/stackly-logo.webp")} alt="Stackly" className="h-4 w-auto object-contain transition duration-300 group-hover/logo:scale-105 md:h-5" />
          </Link>

          <div className="hidden items-center gap-7 text-[13px] font-bold uppercase tracking-wide text-white lg:flex">
            <Link href="/landing" className="stackly-nav-link">HOME</Link>
            <Link href="/landing#features" onClick={(event) => scrollLandingSection(event, "features")} className="stackly-nav-link">ABOUT US</Link>

            <div className="group relative">
              <button type="button" className="stackly-nav-link inline-flex items-center gap-1.5">
                OUR PRODUCTS <FaChevronDown className="text-[10px] transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full w-56 translate-y-3 rounded-2xl border border-white/70 bg-white/95 py-3 opacity-0 shadow-[0_22px_55px_rgba(2,15,38,0.20)] backdrop-blur transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                {products.map((product) => (
                  <Link key={product} href="/landing#templates" onClick={(event) => scrollLandingSection(event, "templates")} className="block border-b border-gray-50 px-5 py-2.5 text-[11px] font-black text-gray-800 transition last:border-0 hover:bg-blue-50 hover:pl-6 hover:text-blue-600">
                    {product}
                  </Link>
                ))}
              </div>
            </div>

            <div className="group relative">
              <button type="button" className="stackly-nav-link inline-flex items-center gap-1.5">
                CATEGORIES <FaChevronDown className="text-[10px] transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full grid w-[590px] translate-y-3 grid-cols-2 gap-1 rounded-2xl border border-white/70 bg-white/95 p-3 opacity-0 shadow-[0_22px_55px_rgba(2,15,38,0.20)] backdrop-blur transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                {navCategories.map(({ title, icon: Icon, items }) => (
                  <Link key={title} href="/landing#categories" onClick={(event) => scrollLandingSection(event, "categories")} className="group/item rounded-xl px-3 py-2 transition hover:-translate-y-0.5 hover:bg-blue-50">
                    <span className="flex items-center gap-2 text-[11px] font-black text-gray-900">
                      <Icon className="text-gray-400 group-hover/item:text-blue-600" />
                      {title}
                    </span>
                    <span className="mt-1 block truncate text-[10px] font-semibold normal-case tracking-normal text-gray-500">
                      {items.slice(0, 4).join(", ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/landing#contact" onClick={(event) => scrollLandingSection(event, "contact")} className="stackly-nav-link">CONTACT</Link>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setActivePanel("cart")}
            aria-label="Open cart"
            className="stackly-icon-button relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#06224C] shadow-sm"
          >
            <FaCartShopping className="text-sm" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onWishlistClick ?? (() => setActivePanel("wishlist"))}
            aria-label="Open wishlist"
            className={`stackly-icon-button relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ${wishlistCount > 0 ? "text-red-500" : "text-[#06224C]"}`}
          >
            {wishlistCount > 0 ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              const currentPath = window.location.pathname.replace(/\/+$/, "");
              const landingPath = assetPath("/landing").replace(/\/+$/, "");

              if (currentPath === landingPath || currentPath === "/landing") {
                window.dispatchEvent(new Event("stackly-open-search"));
                return;
              }

              window.sessionStorage.setItem("stackly-open-search-on-landing", "true");
              window.location.href = assetPath("/landing/");
            }}
            aria-label="Search"
            className="stackly-icon-button inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#06224C] shadow-sm"
          >
            <FaMagnifyingGlass className="text-sm" />
          </button>
          <Link href="/login" aria-label="Login" className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#06224C] hover:shadow-[0_12px_26px_rgba(255,255,255,0.18)] active:scale-95">
            <FaUser className="text-sm" />
          </Link>
        </div>
      </nav>

      {mobileOpen && (
        <div className="stackly-mobile-menu border-t border-white/10 bg-[#06224C]/98 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white shadow-inner lg:hidden">
          <div className="flex flex-col">
            <Link href="/landing" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-3 transition hover:pl-2 hover:text-blue-200">Home</Link>
            <Link href="/landing#features" onClick={(event) => scrollLandingSection(event, "features", true)} className="border-b border-white/10 py-3 transition hover:pl-2 hover:text-blue-200">About Us</Link>
            <Link href="/landing#templates" onClick={(event) => scrollLandingSection(event, "templates", true)} className="border-b border-white/10 py-3 transition hover:pl-2 hover:text-blue-200">Our Products</Link>
            <Link href="/landing#categories" onClick={(event) => scrollLandingSection(event, "categories", true)} className="border-b border-white/10 py-3 transition hover:pl-2 hover:text-blue-200">Categories</Link>
            <Link href="/landing#contact" onClick={(event) => scrollLandingSection(event, "contact", true)} className="py-3 transition hover:pl-2 hover:text-blue-200">Contact</Link>
          </div>
        </div>
      )}
    </header>

    {activePanel && (
      <>
        <button
          type="button"
          aria-label={`Close ${activePanel}`}
          onClick={() => setActivePanel(null)}
          className="fixed inset-0 z-[9998] bg-black/50"
        />
        <aside className="fixed right-0 top-0 z-[9999] flex h-full w-full flex-col bg-white shadow-2xl sm:w-[400px]">
          <div className="flex items-center justify-between border-b bg-white p-6 text-[#06224C]">
            <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest">
              {activePanel === "wishlist" ? <FaHeart className="text-red-500" /> : <FaCartShopping className="text-blue-600" />}
              {activePanel === "wishlist" ? "My Wishlist" : "My Cart"}
            </h2>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="text-gray-400 transition hover:rotate-90 hover:text-red-500"
              aria-label={`Close ${activePanel}`}
            >
              <FaXmark className="text-2xl" />
            </button>
          </div>

          <div className="flex-grow space-y-6 overflow-y-auto p-6">
            {(activePanel === "wishlist" ? wishlistItems : cartItems).length === 0 ? (
              <div className="py-20 text-center">
                {activePanel === "wishlist" ? (
                  <FaRegHeart className="mx-auto mb-4 text-5xl text-gray-200" />
                ) : (
                  <FaCartShopping className="mx-auto mb-4 text-5xl text-gray-200" />
                )}
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Your {activePanel} is empty
                </p>
              </div>
            ) : (
              (activePanel === "wishlist" ? wishlistItems : cartItems).map((storedItem) => {
                const item = normalizeStoredItem(storedItem);
                const title = storedItem.title || storedItem.name || item.title;

                return (
                  <div key={`${activePanel}-${title}`} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                    <img src={assetPath(item.image)} alt={item.alt} className="h-16 w-20 flex-shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black text-[#06224C]">{item.title}</h3>
                      <p className="text-xs italic text-gray-500">{item.type}</p>
                      <p className="mt-1 text-sm font-black text-blue-600">
                        {item.price ? `$ ${item.price}` : activePanel === "cart" ? `Qty ${item.quantity}` : "Saved"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => (activePanel === "wishlist" ? removeWishlistItem(title) : removeCartItem(title))}
                      className="text-gray-300 transition hover:text-red-500"
                      aria-label={`Remove ${item.title} from ${activePanel}`}
                    >
                      <FaXmark />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t bg-gray-50 p-6">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {activePanel === "wishlist" ? "Items saved in wishlist are not reserved." : "Cart items stay saved across pages."}
            </p>
          </div>
        </aside>
      </>
    )}
    </>
  );
}
