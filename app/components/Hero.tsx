"use client";

import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/ziggyedman/" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/in/michaelvaz/" },
  { icon: FaXTwitter, label: "X", href: "https://x.com/ziggyedman" },
  { icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/themichaelvaz" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/ziggyedman" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4">
      {/* Soft glow backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(74,222,128,0.07), transparent), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(122,162,247,0.06), transparent)",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 w-full max-w-4xl animate-fade-in-up">
        {/* Terminal window */}
        <div className="win">
          <div className="win-bar">
            <span className="dot dot--r" />
            <span className="dot dot--y" />
            <span className="dot dot--g" />
            <span className="win-title">michael@baard.cc — zsh — 80×24</span>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="text-sm mb-2">
              <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
              <span className="sh-cmd">whoami</span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(2.2rem, 6.5vw, 3.8rem)", color: "var(--color-heading)" }}
            >
              Michael Vaz<span className="cursor" />
            </h1>

            <p className="mt-3 text-sm md:text-base cmd-out">
              Customer Success Engineer <span className="hl-green">@ Resend</span> · Lousã, Portugal 🇵🇹
            </p>

            <div className="mt-8 text-sm md:text-[15px]">
              <div className="mb-2">
                <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
                <span className="sh-cmd">cat mission.txt</span>
              </div>
              <p className="cmd-out max-w-2xl">
                Based in Portugal. I started out running email servers and stayed for the part I love
                most — <span className="hl-green">getting people unblocked</span>. Since then:{" "}
                <span className="hl-amber">networking, cybersecurity, and support engineering</span>.
                Now I help teams ship email at Resend.
              </p>
            </div>

            {/* Socials as command chips */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs transition-all hover:border-green-400/70 hover:-translate-y-0.5"
                  style={{ borderColor: "var(--color-panel-border)", color: "var(--color-text)" }}
                >
                  <Icon size={14} />
                  {label.toLowerCase()}
                  <span className="dim">↗</span>
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="#bio"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold"
                style={{ background: "#4ade80", color: "#0a0e14" }}
              >
                <span style={{ color: "#0a0e14" }}>➜</span> cat about.txt
              </a>
              <a
                href="#connect"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm border transition-colors hover:border-green-400/70"
                style={{ borderColor: "var(--color-panel-border)", color: "var(--color-text)" }}
              >
                open --connect
              </a>
            </div>

            <div className="mt-8 text-xs dim">
              ▶ <span className="hl-green">system status: operational</span> · uptime{" "}
              <span className="hl-amber">24y</span> and counting
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#bio"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-xs dim hover:text-green-400 transition-colors"
      >
        ↓ scroll
      </a>
    </section>
  );
}
