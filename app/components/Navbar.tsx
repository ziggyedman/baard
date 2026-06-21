"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const sections = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/#bio" },
  { label: "Career", href: "/#career" },
  { label: "Special Features", href: "/#hobbies" },
  { label: "Connect", href: "/#connect" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUserEmail(d.email ?? null))
      .catch(() => setUserEmail(null));
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setUserEmail(null);
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "rgba(42,69,99,0.85)", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          style={{ color: "var(--color-cream)" }}
        >
          <Menu size={22} />
        </button>

        <Link
          href="/"
          className="uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-gold)", fontSize: "1.4rem" }}
        >
          MV
        </Link>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col grain w-[min(80vw,360px)] max-w-full transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "rgba(10, 18, 38, 0.92)", backdropFilter: "blur(16px)", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-bebas)", color: "var(--color-gold)", fontSize: "1.4rem" }}
          >
            MV
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{ color: "var(--color-cream)" }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 pb-16 gap-1">
          {sections.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-3 uppercase leading-none border-b transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-bebas)",
                color: "var(--color-cream)",
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                borderColor: "rgba(245,239,224,0.1)",
              }}
            >
              {label}
            </Link>
          ))}

          <div className="mt-8 pt-8" style={{ borderTop: "2px solid rgba(245,239,224,0.15)" }}>
            {userEmail ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="uppercase leading-none transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    color: "var(--color-gold)",
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                  }}
                >
                  Settings
                </Link>
                <button
                  onClick={signOut}
                  disabled={signingOut}
                  className="self-start uppercase leading-none transition-opacity hover:opacity-70 disabled:opacity-40"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    color: "var(--color-cream)",
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                    opacity: 0.6,
                  }}
                >
                  {signingOut ? "Signing out…" : "Sign Out"}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="uppercase leading-none transition-opacity hover:opacity-70"
                style={{
                  fontFamily: "var(--font-bebas)",
                  color: "var(--color-gold)",
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                }}
              >
                Sign In →
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
