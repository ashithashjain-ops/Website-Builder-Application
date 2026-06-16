"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { FaEye, FaLaptop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import { FaBars, FaRightFromBracket, FaUser, FaXmark } from "react-icons/fa6";

const START_BUILDING_HREF = "/signup";

function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

const navLinks = [
  { label: "Home", hash: "#food-home" },
  { label: "Templates", hash: "#food-templates" },
  { label: "Features", hash: "#food-features" },
  { label: "FAQ", hash: "#food-faq" },
] as const;

// 1. Pass deviceMode down to Header so it knows when to force mobile navigation
function FoodHeader({ deviceMode }: { deviceMode: "desktop" | "tablet" | "mobile" }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("stackly-auth-token");
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!profileOpen && !mobileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileOpen && profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (mobileOpen && headerRef.current && !headerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [profileOpen, mobileOpen]);

  return (
    <header ref={headerRef} className="bg-[#0A1E3D] text-white w-full max-w-full relative z-50">
      <div className={`w-full mx-auto py-4 flex items-center justify-between ${
        deviceMode === "desktop" ? "max-w-7xl px-4 sm:px-6 lg:px-8" : "px-4"
      }`}>
        <button
          type="button"
          className="text-xl font-black text-white no-underline shrink-0 bg-none border-none cursor-pointer p-0 hover:opacity-90 focus-visible:outline-none"
          onClick={() => scrollToSection("food-home")}
        >
          Stackly Food.
        </button>

        {/* Conditionally hide desktop nav based on real deviceMode */}
        <nav className={`${deviceMode === "desktop" ? "hidden md:flex" : "hidden"} items-center gap-6 lg:gap-8`}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="bg-transparent border-none cursor-pointer py-2 px-3 rounded-md transition-colors hover:bg-white/10 text-sm font-medium text-white/90"
              onClick={() => scrollToSection(link.hash.replace("#", ""))}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div ref={profileRef} className="relative hidden sm:block">
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/80 text-white bg-transparent transition-all hover:bg-white/10"
              onClick={() => { setProfileOpen((open) => !open); setMobileOpen(false); }}
            >
              <FaUser size={14} aria-hidden />
            </button>
            {profileOpen && (
              <div className="absolute top-12 right-0 w-40 py-2 bg-white rounded-lg shadow-xl border border-gray-100 z-60">
                <button
                  type="button"
                  className="flex items-center gap-3 w-full py-2.5 px-4 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <FaRightFromBracket size={14} /> Logout
                </button>
              </div>
            )}
          </div>
          
          {/* Conditionally show mobile hamburger */}
          <button
            type="button"
            className={`${deviceMode === "desktop" ? "md:hidden" : "flex"} inline-flex items-center justify-center w-10 h-10 rounded-md border text-white transition-colors ${
              mobileOpen ? "bg-white/20 border-white" : "border-white/60 hover:bg-white/10"
            }`}
            onClick={() => { setMobileOpen((open) => !open); setProfileOpen(false); }}
          >
            {mobileOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#0A1E3D] border-t border-white/10 shadow-2xl flex flex-col py-2 px-4 z-50">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="py-4 px-2 text-white text-base font-medium text-left w-full transition-colors hover:bg-white/10 rounded-md"
              onClick={() => { scrollToSection(link.hash.replace("#", "")); setMobileOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          <div className="mt-2 pt-2 border-t border-white/10">
            <button
              type="button"
              className="flex items-center gap-3 py-4 px-2 w-full text-left text-red-400 text-base font-bold hover:bg-white/5 rounded-md"
              onClick={handleLogout}
            >
              <FaRightFromBracket size={16} /> Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

const foodTemplates = [
  { title: "Fine Dining & Steakhouse", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" },
  { title: "Modern Cafe & Bakery", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" },
  { title: "Authentic Pizzeria", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop" },
  { title: "Bistro & Brunch Bar", image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800&auto=format&fit=crop",},
  { title: "Street Food & Trucks", image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=800&auto=format&fit=crop" },
  { title: "Gourmet Burger Joint", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
];

const buildFeatures = [
  { title: "Design a mouth-watering menu", text: "Showcase your dishes with stunning galleries, categorize your offerings, and easily update prices and seasonal specials in real-time." },
  { title: "Take online reservations", text: "Never double-book a table again. Integrate built-in reservation systems so customers can book their spot directly from their phone." },
  { title: "Accept online orders", text: "Add e-commerce capabilities to your restaurant site for pickup or delivery orders, completely commission-free." },
];

const infraItems = [
  { title: "Mobile-optimized design", text: "Hungry customers are searching on their phones. Our templates are automatically formatted to look perfect on any device." },
  { title: "Local SEO tools", text: "Get found by diners in your area. Built-in SEO settings help your restaurant rank higher on Google Maps and local search results." },
  { title: "Fast loading times", text: "We use a worldwide CDN to ensure your menus and high-quality food images load instantly, providing a seamless browsing experience." },
];

const faqItems = [
  { q: "Can I easily update my menu prices?", answer: "Yes! The Stackly drag-and-drop builder makes it incredibly easy to update text, swap out seasonal dishes, and adjust pricing instantly without touching a line of code." },
  { q: "Do I need to pay commission for online orders?", answer: "No. Unlike third-party delivery apps, setting up an online ordering system through your Stackly website is commission-free. You keep 100% of your profits." },
  { q: "Can customers book tables through the website?", answer: "Absolutely. You can integrate booking forms and reservation widgets that sync directly with your preferred management software." },
  { q: "Are the food templates mobile friendly?", answer: "Yes, all our restaurant templates are 100% responsive. Your menus, contact info, and booking buttons will look perfect and be easy to tap on smartphones." },
];

export default function FoodTemplatesPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="flex flex-col min-h-screen bg-[#F3F4F6] overflow-x-hidden font-sans text-gray-900">
      
      {/* FLOATING DEVICE TOOLBAR */}
      <div className="fixed z-[100] transition-all duration-500 ease-in-out shrink-0 bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 shadow-xl px-4 py-2">
          <Link href="/landing#templates" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 text-[#06224C] transition focus-visible:outline-none" title="Back to Landing">
            <FaEye size={16} />
          </Link>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button onClick={() => setDeviceMode("desktop")} className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-sm hover:shadow-md transition focus-visible:outline-none ${deviceMode === "desktop" ? "border-gray-300 ring-2 ring-[#0A1E3D] text-[#0A1E3D]" : "border-gray-100 text-gray-500"}`} title="Desktop View">
            <FaLaptop size={16} />
          </button>
          <button onClick={() => setDeviceMode("tablet")} className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-sm hover:shadow-md transition focus-visible:outline-none ${deviceMode === "tablet" ? "border-gray-300 ring-2 ring-[#0A1E3D] text-[#0A1E3D]" : "border-gray-100 text-gray-500"}`} title="Tablet View">
            <FaTabletAlt size={16} />
          </button>
          <button onClick={() => setDeviceMode("mobile")} className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-sm hover:shadow-md transition focus-visible:outline-none ${deviceMode === "mobile" ? "border-gray-300 ring-2 ring-[#0A1E3D] text-[#0A1E3D]" : "border-gray-100 text-gray-500"}`} title="Mobile View">
            <FaMobileAlt size={16} />
          </button>
        </div>
      </div>

      <div className={`flex-1 flex justify-center w-full transition-all duration-500 ${deviceMode !== "desktop" ? "py-4 md:py-8 px-2 md:px-4" : ""}`}>
        {/* RESPONSIVE CANVAS FRAME */}
        <div 
          ref={canvasScrollRef}
          className={`bg-white relative flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-500 ease-in-out ${
            deviceMode === "mobile" ? "w-full max-w-[375px] h-[85vh] rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl" 
            : deviceMode === "tablet" ? "w-full max-w-[768px] h-[90vh] rounded-[2rem] border-[8px] border-gray-800 shadow-2xl" 
            : "w-full min-h-screen"
          }`}
        >
          <div className="w-full max-w-full overflow-x-hidden min-w-0">
            <FoodHeader deviceMode={deviceMode} />

            {/* 1. HERO SECTION */}
            <div id="food-home" className={`w-full bg-[#FFF5F5] text-center min-w-0 ${
              deviceMode === "desktop" ? "py-16 sm:py-24 px-4 sm:px-6 lg:px-8" : "py-12 px-4"
            }`}>
              <div className="max-w-3xl mx-auto break-words">
                <h1 className={`font-black text-balance leading-[1.15] text-[#0A1E3D] mb-6 ${
                  deviceMode === "desktop" ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl" : "text-3xl"
                }`}>
                  Create a Mouth-Watering Restaurant Website
                </h1>
                <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Attract hungry customers with a stunning, mobile-friendly website. Showcase your menu, take online reservations, and grow your restaurant business without writing a single line of code.
                </p>
                <Link href={START_BUILDING_HREF} className="inline-flex items-center justify-center min-h-[3.5rem] px-8 rounded-full bg-[#b91c1c] text-white text-base font-bold shadow-xl transition-all hover:bg-red-800 hover:-translate-y-1">
                  Start Building Free
                </Link>
              </div>
            </div>

            {/* 2. TEMPLATES GRID */}
            <section id="food-templates" className={`bg-white min-w-0 ${
              deviceMode === "desktop" ? "py-16 sm:py-24 px-4 sm:px-6 lg:px-8" : "py-12 px-4"
            }`}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 break-words">
                  <h2 className={`font-black text-[#0A1E3D] mb-4 text-balance ${
                    deviceMode === "desktop" ? "text-3xl md:text-4xl" : "text-2xl"
                  }`}>Choose a Food Template to Start</h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">Select a layout designed specifically for the food industry and customize it to match your brand.</p>
                </div>

                <div className={`grid ${
                  deviceMode === "desktop" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" :
                  deviceMode === "tablet" ? "grid-cols-1 sm:grid-cols-2 gap-6" :
                  "grid-cols-1 gap-6"
                }`}>
                  {foodTemplates.map((template) => (
                    <article key={template.title} className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-red-100 min-w-0">
                      <div className="overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] mb-5">
                        <img src={template.image} alt="Template Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <h3 className="text-lg font-bold text-[#0A1E3D] mb-5 truncate">{template.title}</h3>
                        <div className="mt-auto flex gap-3">
                          <Link href="/landing#templates" className="flex-1 rounded-xl border-2 border-dashed border-[#b91c1c] flex items-center justify-center py-2.5 text-sm font-bold text-[#b91c1c] hover:bg-red-50">Preview</Link>
                          <Link href={`/blockpages?template=food`} className="flex-1 rounded-xl bg-[#0A1E3D] flex items-center justify-center py-2.5 text-sm font-bold text-white hover:bg-[#112a52]">Edit</Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. BUILD YOUR WAY (FEATURES) */}
            <section id="food-features" className={`bg-[#FFF5F5] border-y border-red-100/50 min-w-0 ${
              deviceMode === "desktop" ? "py-16 sm:py-24 px-4 sm:px-6 lg:px-8" : "py-12 px-4"
            }`}>
              <div className={`max-w-7xl mx-auto grid items-center ${
                deviceMode === "desktop" ? "grid-cols-1 lg:grid-cols-2 gap-16" : "grid-cols-1 gap-10"
              }`}>
                <div className="break-words order-2 lg:order-1">
                  <h2 className={`font-black text-[#0A1E3D] text-balance leading-tight mb-8 ${
                    deviceMode === "desktop" ? "text-3xl md:text-4xl" : "text-2xl"
                  }`}>Build your restaurant site your way.</h2>
                  <div className="space-y-8">
                    {buildFeatures.map((item) => (
                      <div key={item.title}>
                        <h3 className="text-lg font-bold text-[#0A1E3D] mb-2">{item.title}</h3>
                        <p className="text-base text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={START_BUILDING_HREF} className="inline-flex items-center justify-center min-h-[3.5rem] mt-10 px-8 rounded-full bg-[#0A1E3D] text-white text-base font-bold transition-all hover:bg-[#112a52] hover:-translate-y-1 hover:shadow-lg">
                    Create Your Site
                  </Link>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl order-1 lg:order-2 w-full">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" 
                    alt="Restaurant Management" 
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </section>

            {/* 4. INFRASTRUCTURE */}
            <section className={`bg-[#0A1E3D] text-white min-w-0 ${
              deviceMode === "desktop" ? "py-16 sm:py-24 px-4 sm:px-6 lg:px-8" : "py-12 px-4"
            }`}>
              <div className="max-w-7xl mx-auto">
                <div className={`bg-white/5 rounded-3xl border border-white/10 ${
                  deviceMode === "desktop" ? "p-10 lg:p-16" : "p-6"
                }`}>
                  <h2 className={`font-black mb-10 max-w-2xl text-balance leading-tight ${
                    deviceMode === "desktop" ? "text-3xl md:text-4xl" : "text-2xl"
                  }`}>The powerful infrastructure behind your restaurant.</h2>
                  <div className={`grid ${
                    deviceMode === "desktop" ? "grid-cols-1 md:grid-cols-3 gap-12" :
                    deviceMode === "tablet" ? "grid-cols-1 sm:grid-cols-2 gap-8" :
                    "grid-cols-1 gap-8"
                  }`}>
                    {infraItems.map((item) => (
                      <div key={item.title} className="border-t border-white/20 pt-6">
                        <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. FAQ */}
            <section id="food-faq" className={`bg-white min-w-0 ${
              deviceMode === "desktop" ? "py-16 sm:py-24 px-4 sm:px-6 lg:px-8" : "py-12 px-4"
            }`}>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 break-words">
                  <h2 className={`font-black text-[#0A1E3D] mb-4 text-balance ${
                    deviceMode === "desktop" ? "text-3xl md:text-4xl" : "text-2xl"
                  }`}>Frequently Asked Questions</h2>
                  <p className="text-base text-gray-600">Everything you need to know about building your restaurant website.</p>
                </div>

                <div className="space-y-4">
                  {faqItems.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-gray-300">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between p-5 bg-gray-50/50 text-left"
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        >
                          <span className="font-bold text-[#0A1E3D] pr-4 text-base">{item.q}</span>
                          <span className="text-2xl text-gray-400 shrink-0 font-light" aria-hidden>{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className="p-5 pt-2 text-base text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

           
           
                <Footer /> 
            </div>

          </div>
        </div>
    
    </main>
  );
}