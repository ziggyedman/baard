const credits = [
  {
    role: "Founder & CEO",
    company: "Your Company Name",
    period: "2022 — Present",
    description: "Building something remarkable from the ground up.",
  },
  {
    role: "Senior Product Manager",
    company: "Previous Company",
    period: "2019 — 2022",
    description: "Led cross-functional teams to ship products used by millions.",
  },
  {
    role: "Software Engineer",
    company: "Earlier Company",
    period: "2016 — 2019",
    description: "Wrote production code, shipped features, learned fast.",
  },
  {
    role: "Intern → Full-Time",
    company: "First Company",
    period: "2014 — 2016",
    description: "Where it all began — wearing every hat available.",
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
        {/* Label */}
        <p
          className="text-sm tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          Act II
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
          Professional Credits
        </h2>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        {/* Credits list */}
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

        <p
          className="mt-10 text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-cream)", opacity: 0.4 }}
        >
          * Update career entries in{" "}
          <code className="opacity-70">app/components/Career.tsx</code> with your LinkedIn data
        </p>
      </div>
    </section>
  );
}
