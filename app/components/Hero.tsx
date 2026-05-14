"use client";

import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";
import { ChevronDown } from "lucide-react";

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/YOUR_HANDLE" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com/in/michaelvaz" },
  { icon: FaXTwitter, label: "X", href: "https://x.com/YOUR_HANDLE" },
  { icon: FaFacebook, label: "Facebook", href: "https://facebook.com/YOUR_HANDLE" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/ziggyedman" },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-between grain overflow-hidden"
      style={{ backgroundColor: "var(--color-blue-electric)" }}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
        <span
          className="text-xs md:text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.8 }}
        >
          A Michael Vaz Production
        </span>
        <div className="flex gap-2 items-center">
          <span className="badge text-[10px] px-2 py-1">MV</span>
          <span className="badge text-[10px] px-2 py-1">No. 001</span>
        </div>
      </div>

      {/* Main title */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center py-12">
        <p
          className="text-sm md:text-base tracking-[0.5em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.7 }}
        >
          Presents
        </p>
        <h1
          className="text-3d leading-[0.85] uppercase"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(5rem, 18vw, 18rem)",
            letterSpacing: "-0.01em",
          }}
        >
          Michael
          <br />
          Vaz
        </h1>
        <p
          className="mt-6 md:mt-8 tracking-[0.4em] uppercase"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-cream)",
            fontSize: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          Builder&nbsp;&nbsp;·&nbsp;&nbsp;Trader&nbsp;&nbsp;·&nbsp;&nbsp;Creator
        </p>

        {/* Social icons */}
        <div className="flex gap-6 mt-10 md:mt-12">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="social-icon"
              style={{ color: "var(--color-cream)" }}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-end justify-between px-6 pb-6 md:px-12 md:pb-10">
        {/* Rating badge */}
        <div className="flex flex-col items-start gap-1">
          <span className="badge text-[11px] px-3 py-1" style={{ borderColor: "var(--color-orange-hot)", color: "var(--color-orange-hot)" }}>
            MV-18
          </span>
          <span className="text-[9px] tracking-widest uppercase" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
            Mature Vibes Only
          </span>
        </div>

        {/* Scroll cue */}
        <a
          href="#bio"
          className="flex flex-col items-center gap-1 animate-bounce"
          style={{ color: "var(--color-cream)", opacity: 0.6 }}
          aria-label="Scroll down"
        >
          <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas)" }}>
            Scroll
          </span>
          <ChevronDown size={18} />
        </a>

        {/* Studio seal */}
        <div
          className="badge flex-col text-center px-3 py-2 gap-0"
          style={{ borderColor: "var(--color-cream)", color: "var(--color-cream)", opacity: 0.7, fontSize: "8px", letterSpacing: "0.2em" }}
        >
          <span>BAARD</span>
          <span>STUDIOS</span>
          <span>© 2025</span>
        </div>
      </div>
    </section>
  );
}
