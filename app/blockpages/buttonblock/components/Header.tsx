"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaBars, FaXmark, FaChevronDown, FaChevronRight, 
  FaCartShopping, FaHeart, FaMagnifyingGlass, 
  FaCircleUser, FaGear, FaRightFromBracket,
  FaPager, FaChartLine, FaBriefcase, FaUtensils, 
  FaPlane, FaHouseChimney, FaBed, FaPenNib, 
  FaGraduationCap, FaNewspaper, FaCamera 
} from "react-icons/fa6";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mobile submenu state
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeDesktopCategory, setActiveDesktopCategory] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
        setCategoriesOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeAll = () => {
    setProductsOpen(false);
    setCategoriesOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setMobileCategoriesOpen(false);
    setExpandedCategory(null);
    setActiveDesktopCategory(null);
  };

  useEffect(() => {
    closeAll();
  }, [pathname]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileOpen(prev => !prev);
    setProductsOpen(false);
    setCategoriesOpen(false);
    setProfileOpen(false);
  };

  const toggleProductsDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProductsOpen(prev => !prev);
    setCategoriesOpen(false);
    setProfileOpen(false);
  };

  const toggleCategoriesDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoriesOpen(prev => !prev);
    setProductsOpen(false);
    setProfileOpen(false);
  };

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileOpen(prev => !prev);
    setProductsOpen(false);
    setCategoriesOpen(false);
  };

  const toggleCategoryExpansion = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategory(prev => prev === title ? null : title);
  };

  const handleMockNav = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAll();
  };

  const categoriesData = [
    {
      title: "LANDING PAGE", subtitle: "TYPES", Icon: FaPager, items: [
        "Lead Generating Page", "Click-through Page", "Sales Page", "Product Page", "App Page", "Pre-launch Page", "Event Page", "Splash Page", "Others..."
      ]
    },
    {
      title: "DASHBOARD", subtitle: "STYLES", Icon: FaChartLine, items: [
        "Admin Analytics", "Overview", "User Profile", "Sales", "Marketing", "Finance"
      ]
    },
    {
      title: "PORTFOLIO", subtitle: "CREATIVES", Icon: FaBriefcase, items: [
        "Designer", "Developer", "Agency", "Minimal", "Personal", "Freelancer", "Others"
      ]
    },
    {
      title: "FOOD", subtitle: "RESTAURANTS", Icon: FaUtensils, items: [
        "Burger House", "Pizza Corner", "Fresh & Natural", "Food Stories", "Others"
      ]
    },
    {
      title: "TRAVEL", subtitle: "DESTINATIONS", Icon: FaPlane, items: [
        "Adventure", "Luxury", "Leisure", "Solo Trip", "Family", "Group", "Others"
      ]
    },
    {
      title: "REAL ESTATE", subtitle: "PROPERTIES", Icon: FaHouseChimney, items: [
        "Luxury & Premium", "General", "Commercial", "Residential", "Vacation/Rental", "Modern & Startup", "Portal", "Others"
      ]
    },
    {
      title: "HOTEL", subtitle: "STAY", Icon: FaBed, items: [
        "Resort & Vacation", "Luxury & Premium Style", "Nature & Eco", "Modern & Business", "Boutique & Unique", "Budget & Simple", "Others"
      ]
    },
    {
      title: "BLOG", subtitle: "TOPICS", Icon: FaPenNib, items: [
        "Corporate", "Travel & Life", "Food & Health", "Modern News", "Finance", "Education", "Portfolio", "Minimal", "Others"
      ]
    },
    {
      title: "EDUCATION", subtitle: "LEARNING", Icon: FaGraduationCap, items: [
        "EduSpark", "LearnSphere", "Bright Future", "Skillbridge", "NextGen", "Others"
      ]
    },
    {
      title: "NEWSPAPER", subtitle: "NEWS DESK", Icon: FaNewspaper, items: [
        "Daily Pulse", "Global Times", "NextWave", "The Update Hub", "Prime Report", "Headline Express", "Insight News", "Others"
      ]
    },
    {
      title: "PHOTOGRAPHY", subtitle: "GALLERY", Icon: FaCamera, items: [
        "Wedding", "Baby & Kids", "Fashion", "Studio Personal", "General/Portfolio", "Travel", "Event", "Food", "Others"
      ]
    }
  ];

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-[#06224C] border-b border-white/10 px-2 md:px-12 py-3 shadow-sm flex items-center">
      <div className="nav-container max-w-[1400px] mx-auto flex flex-col w-full relative">
        <div className="flex items-center justify-between gap-1 md:gap-8 w-full">
          <div className="flex items-center gap-2 md:gap-8 flex-1">
            <div className="flex-shrink-0">
              <Link
                href="/"
                tabIndex={-1}
                onClick={closeAll}
                className="bg-white px-2 md:px-4 py-2 md:py-3 rounded-[60%] flex items-center justify-center shadow-md transition hover:scale-95 min-w-[75px] md:min-w-[90px] aspect-[2/1]"
              >
                <img src="/stackly-logo1.png" alt="Stackly Logo" className="h-3 md:h-5 w-auto object-contain" decoding="async" />
              </Link>
            </div>

            <div className="hidden lg:flex nav-primary-links text-[13px] font-bold text-white uppercase tracking-wide items-center gap-x-4 xl:gap-x-8">
              <Link href="/" className="nav-primary-link hover:text-blue-300 hover:-translate-y-[2px] transition-all duration-300" onClick={closeAll}>Home</Link>
              <Link href="/about" className="nav-primary-link hover:text-blue-300 hover:-translate-y-[2px] transition-all duration-300" onClick={closeAll}>About Us</Link>

              <div className="relative dropdown-group flex items-center">
                <button
                  type="button"
                  id="products-dropdown-btn"
                  onClick={toggleProductsDropdown}
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  className="flex items-center gap-1.5 hover:text-blue-300 hover:-translate-y-[2px] transition-all duration-300 whitespace-nowrap text-[13px] font-bold text-white uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-1 cursor-pointer"
                >
                  Our Products <FaChevronDown className={`text-[10px] transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                </button>
                {productsOpen && (
                  <div id="products-menu" role="menu" className="absolute left-0 top-[calc(100%+14px)] w-48 bg-white rounded-xl shadow-2xl transition-all duration-300 z-[100] py-3 border border-gray-100">
                    <a href="#" onClick={handleMockNav} role="menuitem" className="block px-5 py-2.5 text-gray-800 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 border-b border-gray-50 transition-all duration-300 hover:translate-x-1">PREMIUM TEMPLATES</a>
                    <a href="#" onClick={handleMockNav} role="menuitem" className="block px-5 py-2.5 text-gray-800 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 border-b border-gray-50 transition-all duration-300 hover:translate-x-1">UI KITS</a>
                    <a href="#" onClick={handleMockNav} role="menuitem" className="block px-5 py-2.5 text-gray-800 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 border-b border-gray-50 transition-all duration-300 hover:translate-x-1">WORDPRESS THEMES</a>
                    <a href="#" onClick={handleMockNav} role="menuitem" className="block px-5 py-2.5 text-gray-800 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1">FREE ASSETS</a>
                  </div>
                )}
              </div>

              <div className="relative dropdown-group flex items-center">
                <button
                  type="button"
                  id="category-dropdown-btn"
                  onClick={toggleCategoriesDropdown}
                  aria-haspopup="true"
                  aria-expanded={categoriesOpen}
                  className="flex items-center gap-1.5 hover:text-blue-300 hover:-translate-y-[2px] transition-all duration-300 whitespace-nowrap text-[13px] font-bold text-white uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-1 cursor-pointer"
                >
                  Categories <FaChevronDown className={`text-[10px] transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {categoriesOpen && (
                  <div id="category-menu" role="menu" className="absolute left-0 top-[calc(100%+14px)] bg-white rounded-xl shadow-2xl transition-all duration-300 z-[100] border border-gray-100 flex">
                    <div className="w-[220px] py-2 flex flex-col relative">
                      {categoriesData.map((category, idx) => (
                        <div 
                          key={idx} 
                          className="submenu-parent"
                          onMouseEnter={() => setActiveDesktopCategory(category.title)}
                          onMouseLeave={() => setActiveDesktopCategory(null)}
                        >
                          <button 
                            type="button" 
                            role="menuitem" 
                            tabIndex={-1} 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDesktopCategory(prev => prev === category.title ? null : category.title); }}
                            className={`w-full flex items-center justify-between px-5 py-2.5 text-[11px] font-black border-b border-gray-50 transition-colors cursor-pointer ${activeDesktopCategory === category.title ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-blue-50'}`}
                          >
                            <span className="flex items-center gap-2"><category.Icon className="opacity-50 w-4 text-center" /> {category.title}</span>
                            <FaChevronRight className="text-[8px] opacity-30" />
                          </button>
                          
                          <div className={`flyout-menu absolute left-full top-0 h-full w-52 bg-white border border-gray-100 shadow-xl rounded-r-xl rounded-bl-xl overflow-hidden z-[101] transition-all duration-200 ${activeDesktopCategory === category.title ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 -translate-x-2 pointer-events-none'}`}>
                            <div className="px-5 py-3 text-[11px] font-black text-blue-600 border-b border-gray-200 bg-white">
                              {category.subtitle}
                            </div>
                            <div className="flex flex-col py-1 overflow-y-auto max-h-[calc(100%-40px)]">
                              {category.items.map((item, itemIdx) => (
                                <a 
                                  key={itemIdx} 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); closeAll(); }} 
                                  className="flyout-item block px-5 py-2 text-[11px] font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:translate-x-1"
                                >
                                  {item}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/contact" className="nav-primary-link hover:text-blue-300 hover:-translate-y-[2px] transition-all duration-300" onClick={closeAll}>Contact</Link>
            </div>
          </div>

          <div className="nav-actions-group flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <button className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white rounded-full text-[#06224C] hover:bg-gray-100 hover:scale-110 hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer focus:outline-none" type="button" aria-label="Open cart">
              <FaCartShopping className="text-xs md:text-sm" />
              <span id="cartBadge" className="hidden absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">0</span>
            </button>

            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-gray-100 hover:scale-110 hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer focus:outline-none" type="button" aria-label="Open wishlist">
              <FaHeart className="text-xs md:text-sm" />
            </button>

            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white rounded-full text-[#06224C] hover:bg-gray-200 hover:scale-110 hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer focus:outline-none" type="button" aria-label="Open search">
              <FaMagnifyingGlass className="text-xs md:text-sm" />
            </button>

            <div className="relative flex items-center">
              <button
                type="button"
                onClick={toggleProfileMenu}
                id="profile-dropdown-btn"
                aria-label="User Profile"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/40 overflow-hidden cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110 hover:border-white transition-all duration-300 shadow-sm"
              >
                <img src="/profile.png" alt="User Profile Picture" className="w-full h-full object-cover" />
              </button>

              {profileOpen && (
                <div id="profile-menu" className="absolute right-0 top-[calc(100%+14px)] w-48 bg-white rounded-xl shadow-2xl z-[100] py-2 border border-gray-100 text-left">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Menu</p>
                  </div>
                  <a href="#" onClick={handleMockNav} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1">
                    <FaCircleUser className="opacity-50 w-4 text-center" /> ACCOUNT
                  </a>
                  <a href="#" onClick={handleMockNav} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 text-[11px] font-black hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-1">
                    <FaGear className="opacity-50 w-4 text-center" /> SETTINGS
                  </a>
                  <div className="border-t border-gray-50 mt-1">
                    <a href="#" onClick={handleMockNav} className="flex items-center gap-3 px-4 py-2.5 text-red-500 text-[11px] font-black hover:bg-red-50 transition-all duration-300 hover:translate-x-1">
                      <FaRightFromBracket className="w-4 text-center" /> LOGOUT
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu rendered absolutely to prevent pushing down page layout */}
      <div className={`absolute top-full left-0 w-full bg-[#06224C] lg:hidden border-t border-white/10 px-4 py-3 flex-col gap-1 text-white text-sm font-semibold shadow-xl z-[60] max-h-[calc(100vh-60px)] overflow-y-auto transition-all duration-300 ${mobileOpen ? 'flex opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'}`}>
        <Link href="/" onClick={closeAll} className="px-2 py-2 hover:bg-white/10 rounded-md transition-all duration-300 hover:translate-x-1">Home</Link>
        <Link href="/about" onClick={closeAll} className="px-2 py-2 hover:bg-white/10 rounded-md transition-all duration-300 hover:translate-x-1">About Us</Link>

        <div className="flex flex-col">
          <button
            type="button"
            className="text-left px-2 py-2 hover:bg-white/10 rounded-md flex justify-between items-center transition-colors cursor-pointer focus:outline-none"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileProductsOpen(prev => !prev); setMobileCategoriesOpen(false); }}
          >
            Our Products <FaChevronDown className={`text-[10px] transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`flex flex-col pl-6 pr-2 bg-white/5 rounded-md overflow-hidden transition-all duration-300 ${mobileProductsOpen ? 'max-h-60 py-2 mt-1 mb-1 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
            <a href="#" onClick={handleMockNav} className="text-xs hover:text-blue-300 py-1.5 transition-all duration-300 hover:translate-x-1 block">PREMIUM TEMPLATES</a>
            <a href="#" onClick={handleMockNav} className="text-xs hover:text-blue-300 py-1.5 transition-all duration-300 hover:translate-x-1 block">UI KITS</a>
            <a href="#" onClick={handleMockNav} className="text-xs hover:text-blue-300 py-1.5 transition-all duration-300 hover:translate-x-1 block">WORDPRESS THEMES</a>
            <a href="#" onClick={handleMockNav} className="text-xs hover:text-blue-300 py-1.5 transition-all duration-300 hover:translate-x-1 block">FREE ASSETS</a>
          </div>
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            className="text-left px-2 py-2 hover:bg-white/10 rounded-md flex justify-between items-center transition-colors cursor-pointer focus:outline-none"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileCategoriesOpen(prev => !prev); setMobileProductsOpen(false); }}
          >
            Categories <FaChevronDown className={`text-[10px] transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`flex flex-col pl-4 pr-2 bg-white/5 rounded-md overflow-hidden transition-all duration-300 ${mobileCategoriesOpen ? 'max-h-[600px] py-2 mt-1 mb-1 opacity-100 overflow-y-auto' : 'max-h-0 py-0 opacity-0'}`}>
            {categoriesData.map((cat, idx) => (
              <div key={idx} className="flex flex-col border-b border-white/5 last:border-0">
                <button
                  type="button"
                  onClick={(e) => toggleCategoryExpansion(cat.title, e)}
                  className="text-xs hover:text-blue-300 flex items-center justify-between py-2.5 w-full text-left focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <cat.Icon className="w-4 text-center opacity-70" /> {cat.title}
                  </span>
                  <FaChevronDown className={`text-[10px] transition-transform ${expandedCategory === cat.title ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`flex flex-col pl-7 transition-all duration-300 overflow-hidden ${expandedCategory === cat.title ? 'max-h-96 pb-2 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                  {cat.items.map((item, itemIdx) => (
                    <a href="#" onClick={handleMockNav} key={itemIdx} className="text-[11px] text-gray-300 hover:text-white py-1.5 transition-all duration-300 hover:translate-x-1 block">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/contact" onClick={closeAll} className="px-2 py-2 hover:bg-white/10 rounded-md transition-all duration-300 hover:translate-x-1">Contact</Link>
      </div>
    </nav>
  );
}
