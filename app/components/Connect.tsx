import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";

const socials = [
  {
    icon: FaInstagram,
    label: "Instagram",
    handle: "@YOUR_HANDLE",
    href: "https://instagram.com/YOUR_HANDLE",
    color: "#E1306C",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    handle: "michaelvaz",
    href: "https://linkedin.com/in/michaelvaz",
    color: "#0A66C2",
  },
  {
    icon: FaXTwitter,
    label: "X / Twitter",
    handle: "@YOUR_HANDLE",
    href: "https://x.com/YOUR_HANDLE",
    color: "#ffffff",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    handle: "YOUR_HANDLE",
    href: "https://facebook.com/YOUR_HANDLE",
    color: "#1877F2",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    handle: "ziggyedman",
    href: "https://github.com/ziggyedman",
    color: "#ffffff",
  },
];

export default function Connect() {
  return (
    <section
      id="connect"
      className="relative grain overflow-hidden px-6 py-20 md:px-16 md:py-32"
      style={{ backgroundColor: "var(--color-maroon-dark)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Label */}
        <p
          className="text-sm tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.4 }}
        >
          Now Showing At
        </p>

        {/* Heading */}
        <h2
          className="text-3d-sm uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(3rem, 9vw, 7rem)",
          }}
        >
          Find Me Online
        </h2>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        {/* Social grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map(({ icon: Icon, label, handle, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon flex items-center gap-4 p-5"
              style={{
                border: "2px solid rgba(245,239,224,0.15)",
                color: "var(--color-cream)",
                textDecoration: "none",
              }}
            >
              <Icon
                size={28}
                style={{ color, flexShrink: 0 }}
              />
              <div>
                <p
                  className="uppercase leading-none"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "1.25rem", color: "var(--color-cream)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-cream)", opacity: 0.5 }}
                >
                  {handle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-20 pt-10" style={{ borderTop: "1px solid rgba(245,239,224,0.1)" }}>
        <p
          className="text-center text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.3 }}
        >
          © MMXXV by Michael Vaz Pictures, Inc — All Rights Reserved
        </p>
        <p
          className="text-center mt-2"
          style={{ color: "var(--color-cream)", opacity: 0.15, fontSize: "9px", letterSpacing: "0.15em" }}
        >
          BAARD STUDIOS · No animals were harmed in the making of this website
        </p>
      </div>
    </section>
  );
}
