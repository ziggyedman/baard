"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, TerminalSquare } from "lucide-react";

const sections = [
  { label: "Home", href: "/", cmd: "cd ~/" },
  { label: "Bio", href: "/#bio", cmd: "cat about.txt" },
  { label: "Career", href: "/#career", cmd: "git log --career" },
  { label: "Special Features", href: "/#hobbies", cmd: "ls ./off_the_clock/" },
  { label: "Blog", href: "/blog", cmd: "open ./blog/" },
  { label: "Connect", href: "/#connect", cmd: "open --connect" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUserEmail(d.email ?? null);
        setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {
        setUserEmail(null);
        setIsAdmin(false);
      });
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
    setSigningOut(false);
  }

  return (
    <>
      {/* Terminal window chrome as top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b" style={{ borderColor: "var(--color-panel-border)" }}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="dot dot--r" />
            <span className="dot dot--y" />
            <span className="dot dot--g" />
            <span className="win-title hidden sm:block">michael@baard.cc — zsh</span>
          </div>

          <Link
            href="/"
            className="hidden md:block text-sm font-bold"
            style={{ color: "var(--color-heading)" }}
          >
            ~/baard.cc
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-md border transition-colors hover:border-green-400/60"
              style={{ borderColor: "var(--color-panel-border)", color: "var(--color-muted)" }}
            >
              <TerminalSquare size={15} />
              <span className="hidden sm:inline">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer — secondary terminal panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[min(85vw,420px)] max-w-full transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "var(--color-panel)", borderRight: "1px solid var(--color-panel-border)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-panel-border)" }}>
          <div className="flex items-center gap-2">
            <span className="dot dot--r" />
            <span className="dot dot--y" />
            <span className="dot dot--g" />
            <span className="win-title">michael@baard.cc — navigation</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-xs px-2 py-1 rounded border transition-colors hover:border-green-400/60"
            style={{ borderColor: "var(--color-panel-border)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>
            <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span> <span className="sh-cmd">ls -la ./</span>
          </div>

          <div className="flex flex-col">
            {sections.map(({ label, href, cmd }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between py-3 border-b transition-colors"
                style={{ borderColor: "var(--color-panel-border)" }}
              >
                <span className="group-hover:text-green-400 transition-colors text-base" style={{ color: "var(--color-heading)" }}>
                  .{cmd.startsWith("ls") || cmd.startsWith("cd") ? "/" : ""}
                  {label.toLowerCase().replace(" special", "").replace(" ", "_")}
                </span>
                <span className="text-xs dim mono-alias">{cmd}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--color-panel-border)" }}>
            {userEmail ? (
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-xs mb-2 dim">
                  <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span> <span className="sh-cmd">whoami</span>
                </div>
                <div className="hl-amber mb-3">session: {userEmail}</div>
                {isAdmin && (
                  <Link
                    href="/admin/posts"
                    onClick={() => setOpen(false)}
                    className="hl-green hover:underline transition-colors"
                  >
                    sudo open /admin →
                  </Link>
                )}
                <Link href="/settings" onClick={() => setOpen(false)} className="hover:text-green-400 transition-colors" style={{ color: "var(--color-heading)" }}>
                  open /settings →
                </Link>
                <button
                  onClick={signOut}
                  disabled={signingOut}
                  className="self-start dim hover:text-rose-400 transition-colors disabled:opacity-40"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
                >
                  {signingOut ? "[ signing out… ]" : "exit --session"}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs mb-2 dim">
                  <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span> <span className="sh-cmd">auth --init</span>
                </div>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-sm text-green-400 hover:underline"
                >
                  authenticate →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
