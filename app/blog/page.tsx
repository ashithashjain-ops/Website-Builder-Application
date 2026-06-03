"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaDesktop, FaLaptop, FaMobileAlt } from "react-icons/fa";
import Footer from "@/components/Footer";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogHeroTrendArrow from "@/components/blog/BlogHeroTrendArrow";
import { blogCategories } from "@/lib/blogCategories";
import { assetPath } from "@/lib/paths";
import "./blog.css";

const START_BLOGGING_HREF = "/page-not-found";

function scrollToBlogSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

const blogImages = {
  hero: "/blog/hero-meeting.webp",
  templateNew: "/blog/template-travel.webp",
  templateFood: "/blog/template-food.webp",
  templatePersonal: "/blog/template-personal.webp",
  buildDesk: "/blog/build-desk.webp",
  teamWork: "/blog/team-work.webp",
  analytics: "/blog/analytics-dashboard.webp",
  faq: "/blog/faq-help.svg",
};

const templates = [
  {
    title: "New Blog",
    image: blogImages.templateNew,
    alt: "New blog template on laptop",
  },
  {
    title: "Food Blog",
    image: blogImages.templateFood,
    alt: "Food blog template preview",
  },
  {
    title: "Personal Blog",
    image: blogImages.templatePersonal,
    alt: "Personal blog template",
  },
];

const buildFeatures = [
  {
    title: "Design a unique blog",
    text: "Capture your brand's personality with a complete suite of Advanced Design feature in our blog maker.",
  },
  {
    title: "Establish your site's domain name",
    text: "Get a custom domain to build your credibility. For inspiration, check out the Blog Name Generator.",
  },
  {
    title: "Create with content in mind",
    text: "Get a custom domain to build your credibility. For inspiration, check out the Blog Name Generator.",
  },
];

const infraItems = [
  {
    title: "Secure platform",
    text: "Our world class experts and enterprise-grade security system work 24/7 so your audiences' information will always be kept safe and secure.",
  },
  {
    title: "Reliable hosting",
    text: "With free Website hosite on a worldwide CDN, your site is automatically backed up and will be able to handle any situation - from traffic spikes to outages - so you'll always be up and running.",
  },
  {
    title: "Faster loading",
    text: "We have a performance-first culture, meaning our priority is providing the best user experience for you and your visitors, with faster loading sites that perform great on any device.",
  },
];

const runFeatures = [
  {
    title: "Schedule",
    text: "Write when you feel inspired and schedule posts to go live at the best time for you.",
  },
  {
    title: "Collaborate",
    text: "Give multiple writers and editors access to your blog platform so they can help manage your content.",
  },
  {
    title: "Blog anywhere",
    text: "Download the Stackly app to write content and manage your blog anytime, anywhere.",
  },
];

const trendingPosts = [
  {
    title: "How to pick the right blog template in 2026",
    meta: "Trending · Guides",
    excerpt:
      "Compare layout styles, typography, and mobile previews before you publish your first post.",
  },
  {
    title: "10 SEO habits every new blogger should start today",
    meta: "Trending · SEO",
    excerpt:
      "Simple on-page checks, internal links, and publishing cadence that help posts get discovered.",
  },
  {
    title: "Turn one article into a week of social content",
    meta: "Trending · Marketing",
    excerpt:
      "Repurpose headlines, quotes, and visuals from a single blog post across your channels.",
  },
  {
    title: "What to write when you do not know where to start",
    meta: "Trending · Inspiration",
    excerpt:
      "Starter prompts and outline structures that remove blank-page anxiety for first-time bloggers.",
  },
];

const faqItems = [
  {
    q: "Is it free to start a blog?",
    a: "It's completely free to start a blog with Stackly. Plus, you'll get access to a complete suite of blogging features including; blog title generator ,SEO tools, design capabilities, managing and collaboration tools, and analytics.",
  },
  {
    q: "How do blogs make money?",
    a: "Blogs can earn through ads, affiliate links, sponsored posts, digital products, and paid memberships once you grow your audience.",
  },
  {
    q: "Can you import blog posts from WordPress?",
    a: "Yes. You can bring existing posts into Stackly so you can keep publishing without starting from scratch.",
  },
  {
    q: "Is Stackly only for beginner bloggers?",
    a: "Stackly works for beginners and experienced creators with tools for design, SEO, analytics, and team collaboration.",
  },
  {
    q: "What should you blog about?",
    a: "Write about topics you know well and your audience cares about—tutorials, stories, reviews, or updates in your niche.",
  },
];

const hireProfessionalDetails = {
  intro:
    "Work with designers, developers, and content specialists who know Blogify and Stackly inside out.",
  steps: [
    "Share your blog goals, niche, and timeline in a short brief.",
    "Get matched with vetted agencies or freelancers reviewed by our team.",
    "Collaborate on design, setup, and launch—we stay with you until you publish.",
  ],
  services: [
    "Custom blog design and branding",
    "Template customization and layout polish",
    "SEO setup, analytics, and performance tuning",
    "Content strategy and migration from other platforms",
  ],
};

// --- PREVIEW CONFIGURATION ---
type PreviewDevice = "desktop" | "tablet" | "mobile";

const PREVIEW_QUERY_KEY = "preview";

const previewFrames: Record<
  PreviewDevice,
  { label: string; width: string; maxWidth: number; height: number }
> = {
  desktop: { label: "Desktop", width: "100%", maxWidth: 1440, height: 1200 },
  tablet: { label: "Tablet", width: "820px", maxWidth: 820, height: 1180 },
  mobile: { label: "Mobile", width: "390px", maxWidth: 390, height: 844 },
};
// -----------------------------


export default function BlogPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [hireMoreOpen, setHireMoreOpen] = useState(false);

  // --- Logic for Preview Controls ---
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbeddedPreview = searchParams?.get(PREVIEW_QUERY_KEY) === "embed";

  const [deviceMode, setDeviceMode] = useState<PreviewDevice>("desktop");

  const previewParams = new URLSearchParams(searchParams?.toString() || "");
  previewParams.set(PREVIEW_QUERY_KEY, "embed");
  const previewQuery = previewParams.toString();
  const previewSrc = previewQuery ? `${pathname}?${previewQuery}` : pathname;
  const activePreviewFrame = previewFrames[deviceMode];

  const showIframe = !isEmbeddedPreview && deviceMode !== "desktop";
  // ----------------------------------

  return (
    <>
      {/* --- FLOATING TRANSPARENT DEVICE TOGGLE --- */}
      {!isEmbeddedPreview && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-xl border border-gray-400 px-4 py-1.5 shadow-2xl">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`w-9 h-7 flex items-center justify-center rounded-md transition-all duration-200 ${
                deviceMode === "desktop"
                  ? "bg-[#06224C] text-white shadow-sm"
                  : "text-[#06224C] hover:bg-gray-100"
              }`}
              title="Desktop View"
            >
              <FaDesktop size={18} />
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`w-9 h-7 flex items-center justify-center rounded-md transition-all duration-200 ${
                deviceMode === "tablet"
                  ? "bg-[#06224C] text-white shadow-sm"
                  : "text-[#06224C] hover:bg-gray-100"
              }`}
              title="Tablet View"
            >
              <FaLaptop size={18} />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`w-9 h-7 flex items-center justify-center rounded-md transition-all duration-200 ${
                deviceMode === "mobile"
                  ? "bg-[#06224C] text-white shadow-sm"
                  : "text-[#06224C] hover:bg-gray-100"
              }`}
              title="Mobile View"
            >
              <FaMobileAlt size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- CONDITIONAL RENDER: IFRAME OR BLOG CONTENT --- */}
      {showIframe ? (
        <div className="flex flex-col min-h-screen bg-[#f5f7fb] py-12 items-center justify-center">
          <div
            className="transition-all duration-500 ease-in-out"
            style={{
              width: activePreviewFrame.width,
              maxWidth: activePreviewFrame.maxWidth,
            }}
          >
            <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-[#cbd5e1] bg-white shadow-2xl ring-1 ring-black/5">
              <iframe
                title={`${activePreviewFrame.label} preview`}
                src={previewSrc}
                className="block w-full border-0 bg-white"
                style={{ height: activePreviewFrame.height }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <main className="blog-page">
            <BlogHeader />
            
            {/* Top — continuous hero + image + templates (matches screenshot flow) */}
            <div id="blog-home" className="blog-top-zone blog-anchor-section">
              <section className="blog-hero blog-section">
                <div className="blog-inner blog-inner-wide">
                  <div className="blog-hero-content">
                    <h1 className="blog-hero-title">
                      Create a Blog Worth{" "}
                      <span className="blog-hero-title-sharing">
                        Sharing
                        <span className="blog-hero-arrow" aria-hidden>
                          <BlogHeroTrendArrow />
                        </span>
                      </span>
                    </h1>
                    <p className="blog-hero-text">
                      Get a full suite of intuitive design features and powerful marketing
                      tools to create a unique blog that leaves a lasting impression.
                    </p>
                    <Link href={START_BLOGGING_HREF} className="blog-btn-outline">
                      Start Blogging
                    </Link>
                  </div>
                </div>
              </section>

              <div className="blog-hero-image-stage blog-section">
                <div className="blog-inner blog-inner-wide">
                  <div className="blog-hero-image-wrap">
                    <img
                      src={assetPath(blogImages.hero)}
                      alt="Professionals collaborating in a modern office"
                      loading="eager"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 58rem"
                    />
                  </div>
                </div>
              </div>

              <section className="blog-templates-section blog-section">
                <div className="blog-inner blog-inner-wide blog-text-center">
                  <h2 className="blog-section-title blog-templates-title">
                    Blog templates that set you up for success
                  </h2>
                  <p className="blog-section-sub blog-section-sub-center">
                    Choose from 900+ free customizable templates built
                    <br className="blog-sub-br" />
                    with everything you need.
                  </p>
                  <Link href="/landing#templates" className="blog-btn-explore">
                    Explore Template <span aria-hidden>→</span>
                  </Link>
                  <div className="blog-template-grid">
                    {templates.map((item) => (
                      <article key={item.title} className="blog-template-card">
                        <div className="blog-template-image">
                          <img
                            src={assetPath(item.image)}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                          />
                        </div>
                        <span className="blog-template-link">{item.title}</span>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Build your way */}
            <section className="blog-blue blog-blue-bordered blog-section blog-build-section">
              <div className="blog-inner blog-inner-wide blog-split blog-build-split">
                <div className="blog-split-copy">
                  <h2 className="blog-section-title">Build your blog your way.</h2>
                  <ul className="blog-feature-list">
                    {buildFeatures.map((item) => (
                      <li key={item.title}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                  <Link href={START_BLOGGING_HREF} className="blog-btn-navy">
                    Start Blogging
                  </Link>
                </div>
                <div className="blog-split-media">
                  <img
                    src={assetPath(blogImages.buildDesk)}
                    alt="Workspace with laptop and monitor"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="blog-pink blog-section blog-section-pad">
              <div className="blog-inner blog-inner-wide">
                <article className="blog-infra-card">
                  <h2 className="blog-section-title blog-section-title-left">
                    The powerful infrastructure behind your blog
                  </h2>
                  <div className="blog-infra-grid">
                    {infraItems.map((item) => (
                      <div key={item.title} className="blog-infra-col">
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>

            {/* Run efficiently */}
            <section className="blog-blue blog-blue-bordered blog-section blog-section-pad">
              <div className="blog-inner blog-inner-wide blog-split">
                <div className="blog-split-media">
                  <img
                    src={assetPath(blogImages.teamWork)}
                    alt="Team working on laptops"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <div className="blog-split-copy">
                  <h2 className="blog-section-title blog-run-heading">
                    Run your blog more efficiently
                  </h2>
                  <ul className="blog-feature-list">
                    {runFeatures.map((item) => (
                      <li key={item.title}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                  <Link href={START_BLOGGING_HREF} className="blog-btn-navy">
                    Start Blogging
                  </Link>
                </div>
              </div>
            </section>

            {/* Analytics */}
            <section className="blog-pink blog-section blog-section-pad">
              <div className="blog-inner blog-inner-wide">
                <article className="blog-analytics-card">
                  <div className="blog-analytics-inner">
                    <div className="blog-analytics-copy">
                      <h2 className="blog-section-title">
                        Plan ahead with built-in analytics
                      </h2>
                      <p className="blog-section-sub">
                        Get insights from analytics reports like which content best
                        engages your audience, so you can strategically plan for the
                        future.
                      </p>
                      <Link href={START_BLOGGING_HREF} className="blog-link-arrow">
                        Start Blogging
                        <span className="blog-link-arrow-icon" aria-hidden>
                          ↗
                        </span>
                      </Link>
                    </div>
                    <div className="blog-split-media blog-analytics-media">
                      <img
                        src={assetPath(blogImages.analytics)}
                        alt="Analytics dashboard on laptop"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 900px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* Support */}
            <section className="blog-pink blog-section blog-section-pad">
              <div className="blog-inner blog-inner-wide blog-support-grid">
                <article className="blog-support-card">
                  <h3>24/7 support</h3>
                  <p>
                    Find answers to all your questions in our Help Center or request a
                    callback to speak with an expert.
                  </p>
                  <Link
                    href="#blog-contact"
                    className="blog-support-link"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToBlogSection("blog-contact");
                    }}
                  >
                    Get in touch
                  </Link>
                </article>
                <article
                  className={`blog-support-card${hireMoreOpen ? " blog-support-card--expanded" : ""}`}
                >
                  <h3>Hire a professional</h3>
                  <p>
                    Get matched with vetted agencies and freelancers to help you
                    create, design or enhance your website
                  </p>
                  <div
                    id="blog-hire-details"
                    className="blog-support-details"
                    hidden={!hireMoreOpen}
                  >
                    <p className="blog-support-details-intro">
                      {hireProfessionalDetails.intro}
                    </p>
                    <h4 className="blog-support-details-heading">How it works</h4>
                    <ol className="blog-support-details-steps">
                      {hireProfessionalDetails.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <h4 className="blog-support-details-heading">What pros can help with</h4>
                    <ul className="blog-support-details-list">
                      {hireProfessionalDetails.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                    <Link
                      href="#blog-contact"
                      className="blog-support-details-cta"
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToBlogSection("blog-contact");
                      }}
                    >
                      Request a match
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="blog-support-link blog-support-link-btn"
                    aria-expanded={hireMoreOpen}
                    aria-controls="blog-hire-details"
                    onClick={() => setHireMoreOpen((open) => !open)}
                  >
                    {hireMoreOpen ? "Show less" : "Learn more"}
                  </button>
                </article>
              </div>
            </section>

            {/* Categories */}
            <section
              id="blog-categories"
              className="blog-pink blog-section blog-section-pad blog-panel-section blog-anchor-section"
            >
              <div className="blog-inner blog-inner-wide">
                <div className="blog-panel-intro blog-text-center">
                  <h2 className="blog-section-title">Blog categories</h2>
                  <p className="blog-section-sub blog-section-sub-center">
                    Explore every blog style Blogify offers—from personal journals to
                    business publishing—all in one place.
                  </p>
                </div>
                <div className="blog-categories-grid">
                  {blogCategories.map((category) => (
                    <article
                      key={category.id}
                      id={category.id}
                      className="blog-category-card blog-anchor-section"
                    >
                      <div className="blog-category-card-image">
                        <img
                          src={assetPath(category.image)}
                          alt={category.label}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                        />
                      </div>
                      <div className="blog-category-card-body">
                        <h3>{category.label}</h3>
                        <p>{category.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Trending posts */}
            <section
              id="blog-trending"
              className="blog-blue blog-section blog-section-pad blog-panel-section blog-anchor-section"
            >
              <div className="blog-inner blog-inner-wide">
                <div className="blog-panel-intro blog-text-center">
                  <h2 className="blog-section-title">Trending posts</h2>
                  <p className="blog-section-sub blog-section-sub-center">
                    Popular guides and ideas bloggers are reading right now on Blogify.
                  </p>
                </div>
                <div className="blog-trending-list">
                  {trendingPosts.map((post) => (
                    <article key={post.title} className="blog-trending-item">
                      <h3>{post.title}</h3>
                      <p className="blog-trending-meta">{post.meta}</p>
                      <p>{post.excerpt}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* About */}
            <section
              id="blog-about"
              className="blog-pink blog-section blog-section-pad blog-panel-section blog-anchor-section"
            >
              <div className="blog-inner blog-inner-wide">
                <div className="blog-panel-intro blog-text-center">
                  <h2 className="blog-section-title">About Blogify</h2>
                </div>
                <div className="blog-about-content">
                  <p>
                    Blogify helps creators, teams, and businesses launch beautiful blogs
                    without writing code. Choose a template, customize your brand, and
                    publish posts with built-in SEO, analytics, and collaboration tools.
                  </p>
                  <p>
                    Whether you are sharing recipes, travel stories, tech tutorials, or
                    company updates, Blogify gives you the design flexibility and
                    infrastructure to grow your audience with confidence.
                  </p>
                  <p>
                    Stackly powers Blogify with reliable hosting, security, and performance
                    so your site stays fast and available as your readership scales.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section
              id="blog-contact"
              className="blog-blue blog-section blog-section-pad blog-panel-section blog-anchor-section"
            >
              <div className="blog-inner blog-inner-wide">
                <div className="blog-panel-intro blog-text-center">
                  <h2 className="blog-section-title">Contact us</h2>
                  <p className="blog-section-sub blog-section-sub-center">
                    Questions about templates, billing, or getting started? We are here to help.
                  </p>
                </div>
                <div className="blog-contact-content">
                  <p>
                    Reach the Blogify team for product support, partnership inquiries, or
                    help choosing the right blog template for your goals.
                  </p>
                  <ul className="blog-contact-list">
                    <li>
                      Email:{" "}
                      <a href="mailto:support@stackly.com">support@stackly.com</a>
                    </li>
                    <li>
                      Help center:{" "}
                      <Link href="/landing#contact">Visit support resources</Link>
                    </li>
                    <li>Headquarters: MMR Complex, Salem, Tamil Nadu 636008</li>
                    <li>Hours: Monday–Friday, 9:00 AM – 6:00 PM IST</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="blog-faq-section" aria-labelledby="blog-faq-title">
              <div className="blog-faq-heading-wrap blog-section">
                <div className="blog-inner blog-inner-wide">
                  <h2 id="blog-faq-title" className="blog-faq-title">
                    Blog Website FAQ
                  </h2>
                </div>
              </div>
              <div className="blog-faq-body blog-section">
                <div className="blog-inner blog-inner-wide blog-faq-layout">
                  <div className="blog-faq-image">
                    <img
                      src={assetPath(blogImages.faq)}
                      alt="FAQ illustration"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                  <div className="blog-faq-list">
                    {faqItems.map((item, index) => {
                      const isOpen = openFaq === index;
                      return (
                        <div key={item.q} className="blog-faq-item">
                          <button
                            type="button"
                            className="blog-faq-trigger"
                            onClick={() => setOpenFaq(isOpen ? -1 : index)}
                            aria-expanded={isOpen}
                          >
                            <span className="blog-faq-question">{item.q}</span>
                            <span className="blog-faq-icon" aria-hidden>
                              {isOpen ? "×" : "+"}
                            </span>
                          </button>
                          {isOpen && <p className="blog-faq-answer">{item.a}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="blog-pink blog-section blog-cta-wrap">
              <div className="blog-inner blog-inner-wide">
                <div className="blog-cta-card">
                  <h2>Create a blog that inspires.</h2>
                  <Link href={START_BLOGGING_HREF} className="blog-btn-navy">
                    Start Blogging
                  </Link>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
