import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";

const socials = [
  { icon: FaInstagram, label: "Instagram", handle: "@ziggyedman", href: "https://www.instagram.com/ziggyedman/" },
  { icon: FaLinkedinIn, label: "LinkedIn", handle: "/michaelvaz", href: "https://www.linkedin.com/in/michaelvaz/" },
  { icon: FaXTwitter, label: "X / Twitter", handle: "@ziggyedman", href: "https://x.com/ziggyedman" },
  { icon: FaFacebook, label: "Facebook", handle: "themichaelvaz", href: "https://www.facebook.com/themichaelvaz" },
  { icon: FaGithub, label: "GitHub", handle: "@ziggyedman", href: "https://github.com/ziggyedman" },
];

export default function Connect() {
  return (
    <section
      id="connect"
      className="relative overflow-hidden px-6 py-20 md:px-16 md:py-32 border-t"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(74,222,128,0.05), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-sm mb-2">
          <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
          <span className="sh-cmd">open --connect</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "var(--color-heading)" }}>
          Open ports — <span className="hl-green">say hi</span>
        </h2>
        <p className="text-sm dim mb-10">always accepting new connections</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socials.map(({ icon: Icon, label, handle, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={18} className="shrink-0" style={{ color: "var(--color-green)" }} />
                <div className="min-w-0">
                  <div className="text-sm truncate" style={{ color: "var(--color-heading)" }}>
                    {label}
                  </div>
                  <div className="text-xs dim truncate">{handle}</div>
                </div>
              </div>
              <span className="text-xs dim group-hover:text-green-400 transition-colors shrink-0">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t text-xs" style={{ borderColor: "var(--color-panel-border)" }}>
          <div className="dim">
            ▶ <span className="hl-green">system status: operational</span> · support_responsive{" "}
            <span className="hl-green">✓</span> · © MMXXVI <span className="hl-amber">baard studios</span> ·
            no animals were harmed in the making of this website
          </div>
        </div>
      </div>
    </section>
  );
}
