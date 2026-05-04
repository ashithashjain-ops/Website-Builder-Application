/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaPaperPlane, FaPinterest, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { assetPath } from "@/lib/paths";

const footerGroups = [
  ["Product", ["Features", "Templates", "Pricing", "Changelog"]],
  ["Resources", ["Documentation", "API Reference", "Blog", "Status"]],
  ["Company", ["About", "Privacy Policy", "Terms of Service", "Contact"]],
] as const;

const socials = [
  ["Facebook", FaFacebookF, "https://facebook.com"],
  ["YouTube", FaYoutube, "https://youtube.com"],
  ["Instagram", FaInstagram, "https://www.instagram.com/thestackly"],
  ["Pinterest", FaPinterest, "https://pinterest.com"],
  ["X", FaXTwitter, "https://x.com/The_Stackly"],
  ["LinkedIn", FaLinkedinIn, "https://in.linkedin.com/company/the-stackly.com"],
] as const;

export default function Footer() {
  return (
    <footer id="contact" className="mt-auto bg-[#0A1E3D] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-start md:justify-between">
          <div className="w-full md:w-1/2">
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">Subscribe to our Updates</h3>
            <form className="flex max-w-md items-center gap-2" aria-label="Subscribe to updates form">
              <label className="relative flex-grow">
                <span className="sr-only">Email address</span>
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Your email" className="w-full rounded-full bg-white py-3 pl-11 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </label>
              <button type="submit" aria-label="Subscribe" className="text-white transition hover:text-blue-300">
                <FaPaperPlane className="text-xl" />
              </button>
            </form>
          </div>
          <div className="w-full md:w-auto md:text-right">
            <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-white">Headquarters</h3>
            <p className="text-sm leading-relaxed text-white/70">
              MMR Complex, Salem,<br />Tamil Nadu 636008
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerGroups.map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white">{title}</h4>
              <ul className="space-y-2 text-sm font-medium text-white/70">
                {links.map((link) => (
                  <li key={link}>
                    <a href={link === "Contact" ? "#contact" : "#features"} className="transition hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-6 inline-flex aspect-[2/1] min-w-[90px] items-center justify-center rounded-[60%] bg-white px-4 py-3 shadow-md transition hover:scale-105">
              <img src={assetPath("/stackly-logo.webp")} alt="Stackly" className="h-5 w-auto object-contain" />
            </Link>
            <p className="mb-2 text-[11px] font-bold uppercase leading-relaxed tracking-tight text-white/70">
              The <span className="text-blue-400">NO-CODE</span> website builder for everyone. Powered by AWS.
            </p>
            <p className="text-[10px] font-medium uppercase text-white/40">
              Infrastructure built by the Stackly team.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socials.map(([label, Icon, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A1E3D] transition hover:bg-blue-500 hover:text-white">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/50">
              <a href="#features" className="hover:text-white">Terms of Use</a>
              <a href="#features" className="hover:text-white">Privacy Policy</a>
              <span className="whitespace-nowrap">Copyright 2018-2026 TheStackly.com INC</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
