const credits = [
  {
    role: "Customer Success Engineer",
    company: "Resend",
    period: "2026 — Present",
    description:
      "Joined Resend to bring email-first operations and people-focused support to a product I genuinely believe in. I help teams ship reliable messaging workflows while keeping the experience simple and fast.",
    link: "https://resend.com/blog/welcoming-michael-vaz/",
  },
  {
    role: "Principal Support Engineer",
    company: "Atlassian",
    period: "2024 — 2026",
    description:
      "Handling the hardest problems at one of the world's leading software companies. Deep technical expertise across the Atlassian product suite, supporting enterprise customers at scale.",
    link: "https://www.linkedin.com/in/michaelvaz/",
  },
  {
    role: "Tech Lead → Support Engineering",
    company: "Loom",
    period: "2019 — 2024",
    description:
      "Five years across four roles — from Founding Engineer to Tech Lead. Built the support function from the ground up, mentored teams, collaborated with Product & Engineering, and owned the technical escalation path. Loom was later acquired by Atlassian.",
  },
  {
    role: "Senior Technical Support Engineer",
    company: "Sophos",
    period: "2015 — 2018",
    description:
      "Escalations engineer for Endpoint Security Group in Vancouver. Resolved complex cases across Sophos Central, InterceptX, and Exchange security products. Helped launch and mentor the LATAM support team in Buenos Aires.",
  },
  {
    role: "IT Network & Systems Administrator",
    company: "RIS2048 / Gres Panaria Portugal",
    period: "2010 — 2015",
    description:
      "Enterprise IT infrastructure across manufacturing and ceramics industries in Portugal. Server provisioning, security monitoring, backup operations, and HP BladeSystem solutions as a Hewlett Packard CSN Engineer.",
  },
  {
    role: "IT Network & Systems Administrator",
    company: "Serviços Municipalizados de Aveiro",
    period: "2002 — 2010",
    description:
      "Nearly eight years managing city-level IT infrastructure — network administration, system audits, messaging systems, security, and helpdesk. Where the foundation was built.",
  },
];

export default function Career() {
  return (
    <section
      id="career"
      className="relative grain overflow-hidden px-6 py-20 md:px-16 md:py-32"
      style={{ backgroundColor: "var(--color-blue-electric)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2
          className="text-3d-sm uppercase leading-none mb-10 text-left"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(3rem, 9vw, 7rem)",
          }}
        >
          Experience
        </h2>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        <div className="space-y-0">
          {credits.map((item, i) => (
            <div key={i}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 md:gap-8 py-8">
                <div>
                  <h3
                    className="uppercase leading-none mb-1"
                    style={{
                      fontFamily: "var(--font-bebas)",
                      color: "var(--color-orange-hot)",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    }}
                  >
                    {item.role}
                  </h3>
                  <p
                    className="text-base tracking-widest uppercase mb-3"
                    style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.7 }}
                  >
                    {item.company}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--color-cream)", opacity: 0.8 }}>
                    {item.description}
                  </p>
                  {item.link ? (
                    <p className="mt-4 text-sm uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-bebas)", color: "var(--color-gold)", opacity: 0.9 }}>
                      <a href={item.link} target="_blank" rel="noreferrer" className="underline transition-opacity hover:opacity-80">
                        View current work experience on LinkedIn
                      </a>
                    </p>
                  ) : null}
                </div>
                <div
                  className="text-sm tracking-widest uppercase whitespace-nowrap md:text-right md:pt-1"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.45, fontSize: "0.85rem" }}
                >
                  {item.period}
                </div>
              </div>
              {i < credits.length - 1 && (
                <hr className="section-rule" style={{ borderColor: "var(--color-cream)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
