"use client";

import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";
import { ChevronDown } from "lucide-react";

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/ziggyedman/" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/in/michaelvaz/" },
  { icon: FaXTwitter, label: "X", href: "https://x.com/ziggyedman" },
  { icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/themichaelvaz" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/ziggyedman" },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-between grain overflow-hidden"
      style={{ backgroundColor: "var(--color-blue-electric)" }}
    >
      {/* Main title */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center py-16">
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
          Troubleshooter&nbsp;&nbsp;·&nbsp;&nbsp;Creator
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

      {/* Scroll cue */}
      <div className="relative z-10 flex justify-center pb-8">
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
      </div>
    </section>
  );
}
