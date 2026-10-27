const credits = [
  {
    role: "Customer Success Engineer",
    company: "Resend",
    period: "2026 — Now",
    current: true,
    description:
      "Email-first mindset and people-focused support for a product I genuinely believe in. Helping teams ship reliable messaging workflows.",
    link: "https://resend.com/blog/welcoming-michael-vaz/",
  },
  {
    role: "Principal Support Engineer",
    company: "Atlassian",
    period: "2024 — 2026",
    description:
      "Handling the hardest problems at one of the world's leading software companies. Enterprise customers at scale.",
  },
  {
    role: "Tech Lead → Support Engineering",
    company: "Loom (acq. by Atlassian)",
    period: "2019 — 2024",
    description:
      "Four roles in five years. Built the support function from the ground up and owned the technical escalation path.",
  },
  {
    role: "Senior Technical Support Engineer",
    company: "Sophos",
    period: "2015 — 2018",
    description:
      "Escalations for Endpoint Security in Vancouver. Launched and mentored the LATAM support team in Buenos Aires.",
  },
  {
    role: "IT Network & Systems Administrator",
    company: "RIS2048 / Gres Panaria Portugal",
    period: "2010 — 2015",
    description:
      "Enterprise IT infrastructure across manufacturing. HP BladeSystem as an HP CSN Engineer.",
  },
  {
    role: "IT Network & Systems Administrator",
    company: "Serviços Municipalizados de Aveiro",
    period: "2002 — 2010",
    description:
      "Nearly eight years managing citywide IT infrastructure. Where the foundation was built.",
  },
];

export default function Career() {
  return (
    <section
      id="career"
      className="relative overflow-hidden px-6 py-20 md:px-16 md:py-32 border-t"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 90% 30%, rgba(122,162,247,0.05), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-sm mb-8">
          <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
          <span className="sh-cmd">git log --oneline --career</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "var(--color-heading)" }}>
          Commit history — <span className="hl-amber">24 years</span>
        </h2>
        <p className="text-sm dim mb-10">6 commits · latest merge to main</p>

        <div className="space-y-4">
          {credits.map((item, i) => (
            <div
              key={i}
              className="win card-hover group px-5 md:px-7 py-5"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                <div className="text-sm md:text-[15px]">
                  <span className={item.current ? "hl-green" : "dim"}>
                    {item.current ? "+" : "·"}
                  </span>{" "}
                  <span className="text-xs md:text-sm" style={{ color: item.current ? "var(--color-green)" : "var(--color-muted)" }}>
                    {item.period}
                  </span>
                  <span className="dim"> │ </span>
                  <span className="font-bold" style={{ color: "var(--color-heading)" }}>
                    {item.role}
                  </span>
                  <span className="dim"> — </span>
                  <span className="hl-amber">{item.company}</span>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hl-green hover:underline whitespace-nowrap"
                  >
                    view commit ↗
                  </a>
                )}
              </div>
              <div className="text-sm mt-2 md:pl-9" style={{ color: "var(--color-muted)" }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
